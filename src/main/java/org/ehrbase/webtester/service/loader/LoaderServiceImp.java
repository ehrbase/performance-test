/*
 * Copyright (c) 2022 vitasystems GmbH and Hannover Medical School.
 *
 * This file is part of project EHRbase
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.ehrbase.webtester.service.loader;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nedap.archie.json.JacksonUtil;
import com.nedap.archie.rm.composition.Composition;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.MutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.ehrbase.jooq.pg.enums.PartyRefIdType;
import org.ehrbase.jooq.pg.enums.PartyType;
import org.ehrbase.jooq.pg.tables.Ehr;
import org.ehrbase.jooq.pg.tables.Identifier;
import org.ehrbase.jooq.pg.tables.records.EntryRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.serialisation.dbencoding.RawJson;
import org.ehrbase.webtester.service.loader.creators.CompositionCreationInfo;
import org.ehrbase.webtester.service.loader.creators.DataCreator;
import org.ehrbase.webtester.service.loader.creators.EhrCreateDescriptor;
import org.ehrbase.webtester.service.loader.creators.EhrCreator;
import org.ehrbase.webtester.service.loader.jooq.LoaderState;
import org.ehrbase.webtester.service.loader.jooq.LoaderStateRecord;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import org.springframework.web.server.ResponseStatusException;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.sql.Statement;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.Comparator;
import java.util.AbstractMap.SimpleEntry;
import java.util.Map.Entry;
import java.util.PrimitiveIterator.OfInt;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.function.BiFunction;
import java.util.function.IntBinaryOperator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static org.ehrbase.jooq.pg.Tables.*;
import static org.ehrbase.jooq.pg.tables.AuditDetails.AUDIT_DETAILS;
import static org.ehrbase.jooq.pg.tables.Composition.COMPOSITION;
import static org.ehrbase.jooq.pg.tables.Contribution.CONTRIBUTION;
import static org.ehrbase.jooq.pg.tables.Entry.ENTRY;
import static org.ehrbase.jooq.pg.tables.EventContext.EVENT_CONTEXT;
import static org.ehrbase.jooq.pg.tables.Participation.PARTICIPATION;
import static org.ehrbase.jooq.pg.tables.Status.STATUS;
import static org.ehrbase.jooq.pg.tables.TemplateStore.TEMPLATE_STORE;
import static org.ehrbase.jooq.pg.tables.Territory.TERRITORY;
import static org.ehrbase.webtester.service.loader.RandomHelper.getRandomGaussianWithLimitsDouble;
import static org.ehrbase.webtester.service.loader.RandomHelper.getRandomGaussianWithLimitsLong;

/**
 * @author Renaud Subiger
 * @since 1.0
 */
@Service
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "true")
public class LoaderServiceImp implements LoaderService {

    private static class IndexInfo {
        private String name;
        private String ddl;

        private IndexInfo(){
            //For Jackson
        }

        private IndexInfo(String name, String ddl) {
            this.name = name;
            this.ddl = ddl;
        }
    }

    private static class Constraint {
        private String schema;
        private String table;
        private String constraintName;
        private String type;
        private String definition;

        private Constraint(){
            //For Jackson
        }

        private Constraint(String schema, String table, String constraintName, String type, String definition) {
            this.schema = schema;
            this.table = table;
            this.constraintName = constraintName;
            this.type = type;
            this.definition = definition;
        }
    }

    private static final String TEMPLATES_BASE = "classpath*:templates/**";
    private static final String COMPOSITIONS_REPEATABLE_PATH = "classpath*:compositions/repeatable/**";
    private static final String COMPOSITIONS_SINGLE_PATH = "classpath*:compositions/single/**";
    private static final int MAX_COMPOSITION_VERSIONS = 3;
    private static final String SYS_TRANSACTION_FIELD_NAME = "sys_transaction";
    private static final String SYS_PERIOD_FIELD_NAME = "sys_period";
    private static final int JSONB_INSERT_BATCH_SIZE = 1000;
    private final Logger log = LoggerFactory.getLogger(LoaderServiceImp.class);
    // Use a ThreadLocal for our SecureRandom since the generation of the distributions can not be parallelized
    // otherwise
    private final ThreadLocal<Random> random = ThreadLocal.withInitial(SecureRandom::new);
    private final List<Triple<Integer, Composition, JSONB>> singleCompositions = new ArrayList<>();
    private final List<List<Triple<Integer, Composition, JSONB>>> compositionsWithSequenceByType = new ArrayList<>();
    private final ObjectMapper objectMapper = JacksonUtil.getObjectMapper();
    private final RawJson rawJson = new RawJson();
    private final DSLContext primaryDsl;
    private final DSLContext secondaryDsl;
    private final HikariDataSource primaryDataSource;
    private final HikariDataSource secondaryDataSource;
    private final ResourceLoader resourceLoader;

    private LoaderStateRecord currentStateRecord;
    private EhrCreator ehrCreator;
    private boolean isRunning = false;

    public LoaderServiceImp(
            @Qualifier("primaryDsl") DSLContext primaryDsl,
            @Qualifier("secondaryDsl") DSLContext secondaryDsl,
            ResourceLoader resourceLoader,
            @Qualifier("primaryDataSource") HikariDataSource primaryDataSource,
            @Qualifier("secondaryDataSource") HikariDataSource secondaryDataSource) {
        this.primaryDsl = primaryDsl;
        this.secondaryDsl = secondaryDsl;
        this.secondaryDataSource = secondaryDataSource;
        this.primaryDataSource = primaryDataSource;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void initialize() {
        // Initialize everything that does not require DB inserts,
        // because inserts with indexes present are likely to fail with non-transactional writes
        initializeTemplates();
        initializeCompositions();
        ehrCreator = new EhrCreator(
                primaryDsl,
                ZoneId.systemDefault().toString(),
                getSystemId(),
                getCommitterId(),
                primaryDsl.select(TERRITORY.TWOLETTER, TERRITORY.CODE).from(TERRITORY).fetch().stream()
                        .collect(Collectors.toMap(Record2::value1, Record2::value2)),
                singleCompositions,
                compositionsWithSequenceByType);
        ensureLoaderStatusTableAndRecord();
        LoaderPhase currentPhase = LoaderPhase.valueOf(currentStateRecord.getValue());
        if(!EnumSet.of(LoaderPhase.NOT_RUN, LoaderPhase.FINISHED).contains(currentPhase)){
            load(null);
        }
    }

    private void ensureLoaderStatusTableAndRecord() {

        //create the table if necessary
        secondaryDsl.createTableIfNotExists(LoaderState.LOADER_STATE).columns(LoaderState.LOADER_STATE.fields()).primaryKey(LoaderState.LOADER_STATE.ID).unique(LoaderState.LOADER_STATE.KEY).execute();
        //create or load current execution progress
        currentStateRecord = secondaryDsl.fetchOptional(LoaderState.LOADER_STATE,LoaderState.LOADER_STATE.KEY.eq("execution_state")).orElseGet(() -> {
            LoaderStateRecord stateRecord = secondaryDsl.newRecord(LoaderState.LOADER_STATE);
            stateRecord.setId(UUID.randomUUID());
            stateRecord.setKey("execution_state");
            stateRecord.setValue(LoaderPhase.NOT_RUN.name());
            stateRecord.store();
            return stateRecord;
        });
    }

    private void initializeTemplates() {
        try {
            Arrays.stream(ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
                            .getResources(TEMPLATES_BASE))
                    .filter(r -> StringUtils.endsWith(r.getFilename(), ".opt"))
                    .sorted(Comparator.comparing(Resource::getFilename))
                    .forEach(f -> {
                        String templateId;
                        try (InputStream in = f.getInputStream()) {
                            templateId = xpath(in, "//template/template_id/value/text()");
                            createTemplate(templateId, f);
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
                    });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String xpath(InputStream document, String xpathExpression) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false);
            Document doc = factory.newDocumentBuilder().parse(document);

            XPathExpression expr = XPathFactory.newInstance().newXPath().compile(xpathExpression);
            return (String) expr.evaluate(doc, XPathConstants.STRING);

        } catch (ParserConfigurationException | SAXException | IOException | XPathExpressionException e) {
            throw new RuntimeException(e);
        }
    }

    private void initializeCompositions() {
        try {
            final OfInt sequenceNumIterator = IntStream.iterate(0, i -> i + 1).iterator();
            Map<Integer, List<Triple<Integer, Composition, JSONB>>> compByGroup = Arrays.stream(
                            ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
                                    .getResources(COMPOSITIONS_REPEATABLE_PATH))
                    // We need a sequential stream, so we get distinct sequence values
                    .sequential()
                    .filter(r -> StringUtils.endsWith(r.getFilename(), ".json"))
                    .sorted(Comparator.comparing(Resource::getFilename))
                    .map(p -> {
                        try (InputStream in = p.getInputStream()) {
                            if (!p.getFilename().matches("[0-9]{2}_.*")) {
                                throw new LoaderException("composition resource " + p.getFilename()
                                        + " filename has to start with a 2 digit composition group number");
                            }
                            return Pair.of(p.getFilename(), objectMapper.readValue(in, Composition.class));
                        } catch (IOException e) {
                            throw new LoaderException("Failed to read composition file", e);
                        }
                    })
                    .collect(Collectors.groupingBy(
                            p -> Integer.parseInt(p.getLeft().substring(0, 2)),
                            Collectors.mapping(
                                    p -> Triple.of(
                                            sequenceNumIterator.next(),
                                            p.getRight(),
                                            JSONB.jsonb(rawJson.marshal(p.getRight()))),
                                    Collectors.toList())));

            compByGroup.entrySet().stream()
                    .sorted(Entry.comparingByKey())
                    .map(Entry::getValue)
                    .forEach(compositionsWithSequenceByType::add);

            Arrays.stream(ResourcePatternUtils.getResourcePatternResolver(resourceLoader)
                            .getResources(COMPOSITIONS_SINGLE_PATH))
                    // We need a sequential stream, so we get distinct sequence values
                    .sequential()
                    .filter(r -> StringUtils.endsWith(r.getFilename(), ".json"))
                    .map(p -> {
                        try (InputStream in = p.getInputStream()) {
                            if (!p.getFilename().matches("[0-9]{2}_.*")) {
                                throw new LoaderException("composition resource " + p.getFilename()
                                        + " filename has to start with a 2 digit composition group number");
                            }
                            Composition composition = objectMapper.readValue(in, Composition.class);
                            return Triple.of(
                                    sequenceNumIterator.next(),
                                    composition,
                                    JSONB.valueOf(rawJson.marshal(composition)));
                        } catch (IOException e) {
                            throw new LoaderException("Failed to read composition file", e);
                        }
                    })
                    .forEach(singleCompositions::add);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Override
    public void load(LoaderRequestDto properties) {

        if (isRunning) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "A test data loading request is currently being processed. Please try again later...");
        }

        if (properties != null && (properties.getHealthcareFacilities() < 1 || properties.getEhr() < properties.getHealthcareFacilities())) {
            throw new IllegalArgumentException(
                    "EHR count must be greater or equal to the number of healthcareFacilities and greater than 0");
        }

        Optional<LoaderStateRecord> propertiesFromDB = secondaryDsl.fetchOptional(LoaderState.LOADER_STATE, LoaderState.LOADER_STATE.KEY.eq("settings"));
        final LoaderRequestDto settings;
        try {
            if(properties == null){
                settings = objectMapper.readValue(propertiesFromDB.map(LoaderStateRecord::getValue).orElseThrow(() -> new LoaderException("Failed to resume: No properties found in DB.")), LoaderRequestDto.class);
            }else {
                settings = properties;
                if(propertiesFromDB.isPresent()){
                    propertiesFromDB.get().setValue(objectMapper.writeValueAsString(properties));
                    propertiesFromDB.get().update(LoaderState.LOADER_STATE.VALUE);
                }else{
                    LoaderStateRecord propertyRecord = secondaryDsl.newRecord(LoaderState.LOADER_STATE);
                    propertyRecord.setId(UUID.randomUUID());
                    propertyRecord.setKey("settings");
                    propertyRecord.setValue(objectMapper.writeValueAsString(properties));
                    propertyRecord.store();
                }
            }
        } catch (JsonProcessingException e) {
            throw new LoaderException("Failed to read/write settings from/to DB",e);
        }

        isRunning = true;
        ForkJoinPool.commonPool().execute(() -> {
            try {
                LoaderPhase currentPhase = LoaderPhase.valueOf(currentStateRecord.getValue());
                switch (currentPhase){
                    //The fall throughs are intentional, since each earlier phase will include all phases after them
                    case FINISHED:
                        log.warn("A previous run already finished successfully. This run will create new facilities so the data will be independent from the existing data!");
                        preLoadPhase(settings);
                        break;
                    case NOT_RUN:
                        preLoadPhase(settings);
                        break;
                    case PRE_LOAD:
                        throw new LoaderException("Failed to resume: Can't resume preload phase. Please reinitialize the database.");
                    case PHASE_1:
                        truncateDataTables();
                        loadPhase1(settings);
                        break;
                    case PHASE_2:
                        loadPhase2();
                        break;
                    case POST_LOAD:
                        postLoadPhase();
                        break;
                    default:
                        throw new LoaderException("Unknown state " + currentPhase);
                }
                setCurrentPhase(LoaderPhase.FINISHED);
            } catch (RuntimeException e) {
                isRunning = false;
                throw e;
            }
            isRunning = false;
            log.info("Done!");
        });
    }

    private List<String> prepareEntryTables() {
        // We will use temporary entry tables for each composition number for faster JSONB inserts in the end
        List<String> names = IntStream.range(
                        0,
                        compositionsWithSequenceByType.stream()
                                .mapToInt(List::size)
                                .sum()
                                + singleCompositions.size())
                .mapToObj(i -> "entry_" + i)
                .collect(Collectors.toList());
        names.forEach(i -> runStatementWithTransactionalWrites(String.format(
            "CREATE TABLE IF NOT EXISTS ehr.%s("
                    + "    id uuid,"
                    + "    composition_id uuid,"
                    + "    sequence integer,"
                    + "    item_type ehr.entry_type,"
                    + "    template_id text COLLATE pg_catalog.\"default\","
                    + "    template_uuid uuid,"
                    + "    archetype_id text COLLATE pg_catalog.\"default\","
                    + "    category ehr.dv_coded_text,"
                    + "    entry jsonb,"
                    + "    sys_transaction timestamp without time zone,"
                    + "    sys_period tstzrange,"
                    + "    rm_version text COLLATE pg_catalog.\"default\","
                    + "    name ehr.dv_coded_text,"
                    + "    PRIMARY KEY (id));",
            i)));
        return names;
    }

    private List<String> getTableNames() {
        try (Connection c = secondaryDataSource.getConnection();
             Statement s = c.createStatement()) {
            List<String> tableNames = new ArrayList<>();
            s.execute("SELECT DISTINCT tablename FROM pg_tables WHERE schemaname='ehr';");
            try (ResultSet resultSet = s.getResultSet()) {
                while (resultSet.next()) {
                    tableNames.add(resultSet.getString(1));
                }
            }
            return tableNames;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private List<IndexInfo> findIndexes(List<String> constraintNames) {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            s.execute(String.format(
                    "SELECT indexname, indexdef\n" + "FROM pg_indexes\n"
                            + "WHERE schemaname = 'ehr'"
                            + "AND indexname NOT IN (%s)",
                    constraintNames.stream().map(t -> "'" + t + "'").collect(Collectors.joining(","))));
            List<IndexInfo> parsed = new ArrayList<>();
            try (ResultSet resultSet = s.getResultSet()) {
                while (resultSet.next()) {
                    if(!"gin_entry_path_idx".equalsIgnoreCase(resultSet.getString(1))) {
                        parsed.add(new IndexInfo(resultSet.getString(1), resultSet.getString(2)));
                    }
                }
            }
            return parsed;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Constraint> findConstraints() {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            s.execute("SELECT nsp.nspname,rel.relname,con.conname, con.contype, pg_get_constraintdef(con.oid)"
                    + "       FROM pg_catalog.pg_constraint con"
                    + "            INNER JOIN pg_catalog.pg_class rel"
                    + "                       ON rel.oid = con.conrelid"
                    + "            INNER JOIN pg_catalog.pg_namespace nsp"
                    + "                       ON nsp.oid = connamespace"
                    + "       WHERE nsp.nspname = 'ehr' AND con.contype IN ('u','p');");
            List<Constraint> parsed = new ArrayList<>();
            try (ResultSet resultSet = s.getResultSet()) {
                while (resultSet.next()) {
                    parsed.add(new Constraint(
                            resultSet.getString(1),
                            resultSet.getString(2),
                            resultSet.getString(3),
                            resultSet.getString(4),
                            resultSet.getString(5)));
                }
            }
            return parsed;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private void truncateDataTables(){
        secondaryDsl.truncate(PARTY_IDENTIFIED).cascade().execute();
        secondaryDsl.truncate(AUDIT_DETAILS).cascade().execute();
        secondaryDsl.truncate(CONTRIBUTION).cascade().execute();
        secondaryDsl.truncate(COMPOSITION).cascade().execute();
        secondaryDsl.truncate(EVENT_CONTEXT).cascade().execute();
        secondaryDsl.truncate(ENTRY).cascade().execute();
        secondaryDsl.truncate(PARTICIPATION).cascade().execute();
        secondaryDsl.truncate(EHR_).cascade().execute();
        secondaryDsl.truncate(EHR_STATUS).cascade().execute();
        getStateDataFromDB("temp_tables", String.class).forEach(
                t -> secondaryDsl.truncate("ehr."+t).cascade().execute());
    }

    private void serializeAndStoreAsLoaderState(String key, Object toStore){
        Optional<LoaderStateRecord> indexesRecord = secondaryDsl.fetchOptional(LoaderState.LOADER_STATE, LoaderState.LOADER_STATE.KEY.eq(Objects.requireNonNull(key)));
        try{
            if (indexesRecord.isPresent()) {
                indexesRecord.get().setValue(objectMapper.writeValueAsString(toStore));
                indexesRecord.get().update(LoaderState.LOADER_STATE.VALUE);
            }else{
                LoaderStateRecord newRecord = secondaryDsl.newRecord(LoaderState.LOADER_STATE);
                newRecord.setId(UUID.randomUUID());
                newRecord.setKey(key);
                newRecord.setValue(objectMapper.writeValueAsString(toStore));
                newRecord.store();
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void setCurrentPhase(LoaderPhase phase){
        currentStateRecord.setValue(phase.name());
        currentStateRecord.update(LoaderState.LOADER_STATE.VALUE);
    }

    private void preLoadPhase(LoaderRequestDto settings) {

        setCurrentPhase(LoaderPhase.PRE_LOAD);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start("gather-db-info");
        List<String> tableNames = getTableNames();
        serializeAndStoreAsLoaderState("tables", tableNames);
        List<String> tmpTables = prepareEntryTables();
        serializeAndStoreAsLoaderState("tmp_tables", tmpTables);
        // Loading costraints/indexes assumes postgres/yugabyte as DB vendor
        List<Constraint> indexConstraints = findConstraints();
        List<IndexInfo> indexes = findIndexes(
                indexConstraints.stream().map(c -> c.constraintName).collect(Collectors.toList()));
        serializeAndStoreAsLoaderState("indexes", indexes);
        List<Constraint> uniqueConstraints = indexConstraints.stream()
                .filter(cs -> "u".equalsIgnoreCase(cs.type))
                .collect(Collectors.toList());
        serializeAndStoreAsLoaderState("unique_constraints", uniqueConstraints);

        stopWatch.stop();
        log.info("Loaded necessary info from DB in {}ms",stopWatch.getLastTaskTimeMillis());

        stopWatch.start("constraints-indexes");
        log.info("Dropping unique constraints...");
        uniqueConstraints
                .forEach(cs -> runStatementWithTransactionalWrites(String.format(
                        "ALTER TABLE %s.%s DROP CONSTRAINT IF EXISTS %s;", cs.schema, cs.table, cs.constraintName)));

        log.info("Dropping non primary key indexes...");
        indexes.forEach(indexInfo -> runStatementWithTransactionalWrites(
                String.format("DROP INDEX IF EXISTS ehr.%s;", indexInfo.name)));
        stopWatch.stop();
        log.info("Removed indexes and unique constraints in {}ms", stopWatch.getLastTaskTimeMillis());

        stopWatch.start("triggers");
        log.info("Disabling all triggers...");
        // We assume Postgres or Yugabyte as DB vendor -> disabling triggers will also disable foreign key
        // constraints
        Stream.concat(tableNames.stream(), tmpTables.stream()).forEach(table -> runStatementWithTransactionalWrites(
                String.format("ALTER TABLE ehr.%s DISABLE TRIGGER ALL;", table)));
        stopWatch.stop();
        log.info("Disabled triggers in {}ms", stopWatch.getLastTaskTimeMillis());
        log.info("Completed pre load operations in {}s", stopWatch.getTotalTimeSeconds());

        loadPhase1(settings);
    }

    private void loadPhase1(LoaderRequestDto properties) {

        setCurrentPhase(LoaderPhase.PHASE_1);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start("prep");

        log.info(
                "Test data loading options [EHRs: {}, Facilities: {}, Bulk insert size {}, EHRs per batch: {}, Create versions: {}]",
                properties.getEhr(),
                properties.getHealthcareFacilities(),
                properties.getBulkSize(),
                properties.getEhrsPerBatch(),
                properties.isInsertVersions());
        log.info("Preparing EHR distributions...");
        // Create healthcare facilities and the assigned HCPs in Table party_identified
        Map<Integer, UUID> facilityNumberToUuid = IntStream.range(0, properties.getHealthcareFacilities())
                .parallel()
                .mapToObj(this::insertHealthcareFacility)
                .collect(Collectors.toMap(Pair::getKey, Pair::getValue));
        Map<UUID, List<UUID>> facilityIdToHcpId =
                insertHCPsForFacilities(facilityNumberToUuid, properties.getBulkSize());

        /* Determine how many facilities should be assigned to each EHR (normal dist. m: 7 sd: 3)
        This Step will take a while for high EHR counts (i.e. 10,000,000) since the random number generation is
        synchronized */
        List<MutablePair<Integer, Long>> facilityCountToEhrCountDistribution = IntStream.range(0, properties.getEhr())
                .parallel()
                .mapToObj(e -> (int) getRandomGaussianWithLimitsLong(7, 3, 1, 16))
                .collect(Collectors.groupingBy(i -> i, Collectors.counting()))
                .entrySet()
                .stream()
                .sorted((i1, i2) -> -Integer.compare(i1.getKey(), i2.getKey()))
                .map(MutablePair::of)
                .collect(Collectors.toList());

        long ehrFacilityCountSum = facilityCountToEhrCountDistribution.parallelStream()
                .mapToLong(i -> i.getKey() * i.getValue())
                .sum();
        List<MutablePair<UUID, Integer>> scaledEhrDistribution =
                buildScaledFacilityToEhrDistribution(properties, facilityNumberToUuid, ehrFacilityCountSum);

        stopWatch.stop();
        log.info("EHR Distributions prepared in {} s", stopWatch.getTotalTimeSeconds());
        log.info(
                "Start loading test data... ({} EHRs, {} Healthcare Facilities)",
                properties.getEhr(),
                properties.getHealthcareFacilities());

        // We do not insert multiple batches at once to limit memory usage
        CompletableFuture<Void> currentInsertTask = null;
        int batches = properties.getEhr() / properties.getEhrsPerBatch() + 1;
        int lastBatchSize = properties.getEhr() % properties.getEhrsPerBatch();
        for (int batch = 0; batch < batches; batch++) {
            int batchSize = batch == batches - 1 ? lastBatchSize : properties.getEhrsPerBatch();
            if (batch == batches - 1 && batchSize < 1) {
                // if the last batch is of size 0 we don't need to build and start it
                break;
            }
            // Prepare data to insert while current insert task is running
            List<EhrCreateDescriptor> ehrDescriptors = getEhrSettingsBatch(
                    facilityNumberToUuid, facilityCountToEhrCountDistribution, scaledEhrDistribution, batchSize)
                    .stream()
                    .map(ehrInfo -> ehrCreator.create(new EhrCreator.EhrCreationInfo(
                            ehrInfo.getRight(),
                            ehrInfo.getLeft(),
                            facilityIdToHcpId,
                            EnumSet.of(CompositionCreationInfo.CompositionDataMode.LEGACY))))
                    .collect(Collectors.toList());

            // Wait for the current insert batch to complete
            if (currentInsertTask != null) {
                waitForTaskToComplete(currentInsertTask);
                stopWatch.stop();
                log.info("Batch {} completed in {} ms", batch - 1, stopWatch.getLastTaskTimeMillis());
            }
            stopWatch.start("insert-batch" + batch);
            // Insert the already prepared batch
            currentInsertTask = insertEhrsAsync(ehrDescriptors, properties.getBulkSize());
        }

        // wait for the last insert batch to complete
        waitForTaskToComplete(currentInsertTask);
        if (stopWatch.isRunning()) {
            stopWatch.stop();
        }
        log.info("Last Batch completed in {} ms", stopWatch.getLastTaskTimeMillis());
        log.info("Completed loading phase 1 in {} s", stopWatch.getTotalTimeSeconds());

        loadPhase2();
    }

    private void loadPhase2(){

        setCurrentPhase(LoaderPhase.PHASE_2);

        StopWatch stopWatch = new StopWatch();
        log.info("Copying to ehr.entry with JSONB data...");
        stopWatch.start("jsonb");
        waitForTaskToComplete(CompletableFuture.allOf(Stream.concat(
                        singleCompositions.stream(),
                        compositionsWithSequenceByType.stream().flatMap(List::stream))
                .map(ci -> CompletableFuture.runAsync(() -> copyIntoEntryTableWithJsonb(ci.getLeft(), ci.getRight())))
                .toArray(CompletableFuture[]::new)));
        stopWatch.stop();
        log.info("Completed loading phase 2 (Entry JSONB) in {} ms", stopWatch.getTotalTimeSeconds());

        postLoadPhase();
    }

    private void postLoadPhase() {

        setCurrentPhase(LoaderPhase.POST_LOAD);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start("gather-info");
        List<String> tableNames = getStateDataFromDB("tables", String.class);
        List<String> tmpTableNames = getStateDataFromDB("tmp_tables", String.class);
        List<IndexInfo> indexes = getStateDataFromDB("indexes", IndexInfo.class);
        List<Constraint> uniqueConstraints = getStateDataFromDB("unique_constraints", Constraint.class);
        stopWatch.stop();
        log.info("Loaded post load op info from DB in {}ms", stopWatch.getLastTaskTimeMillis());

        final List<String> failedStatements = new ArrayList<>();
        stopWatch.start("triggers");
        // All streams are explicitly marked as sequential since parallel catalog updates may lead to conflicts
        log.info("Re-enabling triggers...");
        tableNames.stream()
                .sequential()
                .map(table -> String.format(
                        "ALTER TABLE %s.%s ENABLE TRIGGER ALL;", org.ehrbase.jooq.pg.Ehr.EHR.getName(), table))
                .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));
        stopWatch.stop();
        log.info("Enabled triggers in {}ms", stopWatch.getLastTaskTimeMillis());

        stopWatch.start("indexes-constraints");
        log.info("Re-Creating indexes...");
        indexes.stream()
                .sequential()
                .map(i -> i.ddl)
                .map(s -> s + ";")
                .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));
        log.info("Re-Creating unique constraints...");
        uniqueConstraints.stream()
                .sequential()
                .map(cs -> String.format(
                        "ALTER TABLE %s.%s ADD CONSTRAINT %s %s;",
                        cs.schema, cs.table, cs.constraintName, cs.definition))
                .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));
        stopWatch.stop();
        log.info("Created indexes and unique constraints in {}ms", stopWatch.getLastTaskTimeMillis());

        stopWatch.start("tmp-tables");
        log.info("Removing temporary entry tables...");
        tmpTableNames
                .forEach(n -> runStatementWithTransactionalWrites(
                        String.format("DROP TABLE ehr.%s;", n), failedStatements));
        stopWatch.stop();
        log.info("Removed temporary tables in {}ms", stopWatch.getLastTaskTimeMillis());
        log.info("Completed post load operations in {}s", stopWatch.getTotalTimeSeconds());

        log.info("GIN index on ehr.entry.entry will not be recreated automatically, "
                + "because it is a very long running operation. \n"
                + "Please add it manually, if you want to have it. Statement: \n"
                + "CREATE INDEX gin_entry_path_idx ON ehr.entry USING gin (entry jsonb_path_ops);");
        if (!failedStatements.isEmpty()) {
            log.error(
                    "The following post load SQL statements failed. Indexes may exist in an incomplete state.\n"
                            +"Please delete the mentioned indexes and run these statements manually: \n {}",
                    String.join("\n", failedStatements));
        }
    }

    private <R> List<R> getStateDataFromDB(String key, Class<R> objClass) {
        String value = secondaryDsl.fetchOptional(LoaderState.LOADER_STATE, LoaderState.LOADER_STATE.KEY.eq(Objects.requireNonNull(key))).map(LoaderStateRecord::getValue).orElseThrow();
        try {
            return objectMapper.readerForListOf(objClass).readValue(value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void runStatementWithTransactionalWrites(String createStatement) {
        runStatementWithTransactionalWrites(createStatement, null);
    }

    private void runStatementWithTransactionalWrites(String createStatement, List<String> errors) {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            s.setQueryTimeout(0);
            log.debug(createStatement);
            s.execute(createStatement);
        } catch (SQLException e) {
            log.error("Error while executing SQL statement", e);
            if (errors != null) {
                errors.add(createStatement);
            } else {
                throw new RuntimeException(e);
            }
        }
    }

    private Map<UUID, List<UUID>> insertHCPsForFacilities(Map<Integer, UUID> facilityNumberToUuid, int bulkSize) {
        // Generate HCPs according to a normal distribution (m: 20 sd: 5)
        // Names are following a schema of "hcf<facilitynumber>hcp<hcp-number-in-facility>"
        Map<UUID, List<PartyIdentifiedRecord>> facilityIdToHcp = facilityNumberToUuid.entrySet().parallelStream()
                .collect(Collectors.toMap(
                        Entry::getValue, e -> IntStream.range(0, (int) getRandomGaussianWithLimitsLong(20, 5, 5, 35))
                                .mapToObj(i -> DataCreator.createPartyWithRef(
                                        primaryDsl,
                                        "hcf" + e.getKey() + "hcp" + i,
                                        "hcp",
                                        "PERSON",
                                        PartyType.party_identified))
                                .collect(Collectors.toList())));

        bulkInsert(
                PARTY_IDENTIFIED,
                facilityIdToHcp.entrySet().stream().map(Entry::getValue).flatMap(List::stream),
                bulkSize);

        return facilityIdToHcp.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> e.getValue().stream()
                .map(PartyIdentifiedRecord::getId)
                .collect(Collectors.toList())));
    }

    private <R> R waitForTaskToComplete(CompletableFuture<R> insertTask) {
        if (insertTask != null) {
            try {
                return insertTask.get();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException(e);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            }
        }
        throw new LoaderException("Task failed");
    }

    private CompletableFuture<Void> insertEhrsAsync(List<EhrCreateDescriptor> ehrDescriptors, int bulkSize) {
        CompletableFuture<Void> eventContext = CompletableFuture.runAsync(() -> bulkInsert(
                EVENT_CONTEXT, ehrDescriptors.stream().flatMap(e -> e.getEventContexts().stream()), bulkSize));
        CompletableFuture<Void> composition = CompletableFuture.runAsync(() ->
                bulkInsert(COMPOSITION, ehrDescriptors.stream().flatMap(e -> e.getCompositions().stream()), bulkSize));
        CompletableFuture<Void> auditDetails = CompletableFuture.runAsync(() -> bulkInsert(
                AUDIT_DETAILS, ehrDescriptors.stream().flatMap(e -> e.getAuditDetails().stream()), bulkSize));
        CompletableFuture<Void> entry = CompletableFuture.allOf(ehrDescriptors.stream()
                .flatMap(d -> d.getEntries().stream())
                .collect(Collectors.groupingBy(EntryRecord::getSequence))
                .entrySet()
                .stream()
                .map(e -> CompletableFuture.runAsync(() ->
                        bulkInsert(ENTRY.rename(ENTRY.getName() + "_" + e.getKey()), e.getValue().stream(), bulkSize)))
                .toArray(CompletableFuture[]::new));
        CompletableFuture<Void> participations = CompletableFuture.runAsync(() -> bulkInsert(
                PARTICIPATION, ehrDescriptors.stream().flatMap(e -> e.getParticipations().stream()), bulkSize));
        CompletableFuture<Void> contribution = CompletableFuture.runAsync(() -> bulkInsert(
                CONTRIBUTION, ehrDescriptors.stream().flatMap(e -> e.getContributions().stream()), bulkSize));
        CompletableFuture<Void> partyIdentified = CompletableFuture.runAsync(() ->
                bulkInsert(PARTY_IDENTIFIED, ehrDescriptors.stream().map(EhrCreateDescriptor::getSubject), bulkSize));
        CompletableFuture<Void> status = CompletableFuture.runAsync(
                () -> bulkInsert(STATUS, ehrDescriptors.stream().map(EhrCreateDescriptor::getStatus), bulkSize));
        CompletableFuture<Void> ehr = CompletableFuture.runAsync(
                () -> bulkInsert(Ehr.EHR_, ehrDescriptors.stream().map(EhrCreateDescriptor::getEhr), bulkSize));

        return CompletableFuture.allOf(
                entry,
                auditDetails,
                composition,
                eventContext,
                participations,
                status,
                partyIdentified,
                contribution,
                ehr);
    }

    private void copyIntoEntryTableWithJsonb(int compositionNumber, JSONB jsonbData) {
        StopWatch sw = new StopWatch();
        sw.start("count");
        long tableSize = entryTableSize(compositionNumber);
        long loops = (tableSize / JSONB_INSERT_BATCH_SIZE) + 1;
        sw.stop();
        log.info("Count comp {} took {}ms. Result: {}", compositionNumber, sw.getLastTaskTimeMillis(), tableSize);
        int errorCount = 0;

        for (long i = 0; i < loops; i++) {
            sw.start("batch" + i);
            try {
                Pair<Integer, Double> insertCountWithTime;
                insertCountWithTime = copyBatchIntoEntryTableWithJsonb(compositionNumber, jsonbData);
                sw.stop();
                log.info(
                        "Copy comp {} batch: {}, count: {}, execution-time: {}s, total-time: {}ms",
                        compositionNumber,
                        i - errorCount,
                        insertCountWithTime.getLeft(),
                        insertCountWithTime.getRight(),
                        sw.getLastTaskTimeMillis());
            } catch (SQLException e) {
                sw.stop();
                log.error(
                        "Error while processing comp " + compositionNumber + " batch: " + i
                                + ", time (ms) until error: " + sw.getLastTaskTimeMillis(),
                        e);
                errorCount++;
                // We stop if errors keep piling up for the same composition since this indicates a non
                // "memory-pressure" issue
                if (errorCount > 1000) {
                    throw new RuntimeException(
                            "Aborting because error threshold was reached for composition " + compositionNumber);
                }
                loops++;
            }
        }
        log.info("Copying comp {} done in {}s", compositionNumber, sw.getTotalTimeSeconds());
    }

    private Pair<Integer, Double> copyBatchIntoEntryTableWithJsonb(int compositionNumber, JSONB jsonbData)
            throws SQLException {
        try (Connection c = primaryDataSource.getConnection()) {
            StopWatch sw = new StopWatch();
            sw.start();
            try (Statement s = c.createStatement()) {
                s.setQueryTimeout(0);
                String statement = String.format(
                        "/*+ Leading( (\"ANY_subquery\" a) ) NestLoop(\"ANY_subquery\" a) */"
                                + "WITH del AS(DELETE FROM ehr.entry_%d a WHERE a.id in (SELECT id from ehr.entry_%d limit %d) RETURNING *)"
                                + "INSERT INTO ehr.entry "
                                + "  SELECT \"id\","
                                + "  \"composition_id\","
                                + "  0,"
                                + "  \"item_type\","
                                + "  \"template_id\","
                                + "  \"template_uuid\","
                                + "  \"archetype_id\","
                                + "  \"category\","
                                + "  '%s'::JSONB,"
                                + "  \"sys_transaction\","
                                + "  \"sys_period\","
                                + "  \"rm_version\","
                                + "  \"name\""
                                + "FROM del;",
                        compositionNumber, compositionNumber, JSONB_INSERT_BATCH_SIZE, jsonbData.data());
                int i = s.executeUpdate(statement);
                sw.stop();
                return Pair.of(i, sw.getTotalTimeSeconds());
            } catch (SQLException e) {
                sw.stop();
                // Some errors may result in a broken DB session therefore we evict the connection from the pool
                primaryDataSource.evictConnection(c);
                throw e;
            }
        }
    }

    private long entryTableSize(int compositionNumber) {
        return primaryDsl
                .select(DSL.aggregate("count", Long.class, ENTRY.rename(ENTRY.getName() + "_" + compositionNumber).ID))
                .from(ENTRY.rename(ENTRY.getName() + "_" + compositionNumber))
                .fetchOptional(0, Long.class)
                .orElse(0L);
    }

    private <T extends Table<R>, R extends TableRecord<R>> void updateToAddVersions(
            T table,
            TableField<R, UUID> idField,
            List<EhrCreateDescriptor> descriptors,
            BiFunction<EhrCreateDescriptor, Integer, Stream<UUID>> descriptorToIdsForVersionCountStreamFunc,
            OffsetDateTime additionalVersionBaseDateTime) {
        StopWatch sw = new StopWatch();
        sw.start();

        for (int i = 2; i <= MAX_COMPOSITION_VERSIONS; i++) {
            int versionCount = i;
            primaryDsl
                    .update(table)
                    .set(
                            table.field(SYS_TRANSACTION_FIELD_NAME, Timestamp.class),
                            Timestamp.from(
                                    additionalVersionBaseDateTime.plusSeconds(i).toInstant()))
                    .set(
                            table.field(SYS_PERIOD_FIELD_NAME, SimpleEntry.class),
                            new AbstractMap.SimpleEntry<>(additionalVersionBaseDateTime.plusSeconds(i), null))
                    .where(idField.in(descriptors.stream()
                            .flatMap(e -> descriptorToIdsForVersionCountStreamFunc.apply(e, versionCount))
                            .collect(Collectors.toList())))
                    .execute();
        }

        sw.stop();
        log.info("Updates {} for versions took {}", table.getName(), sw.getTotalTimeSeconds());
    }

    private <T extends Table<R>, R extends TableRecord<R>> void bulkInsert(
            T table, Stream<R> recordStream, int bulkSize) {
        StopWatch sw = new StopWatch();
        sw.start();
        boolean success = false;
        int errorCount = 0;
        List<R> records = recordStream.collect(Collectors.toList());
        // With yugabyte on rare occasions bulk inserts may fail, therefore we retry
        // already inserted rows from the bulk due to non-transactional writes are overwritten, because of
        // yb_enable_upsert_mode
        while (!success && errorCount < 100) {
            if (errorCount > 0) {
                log.info("Retrying failed bulk insert. table: {}, retry-attempt: {}", table.getName(), errorCount);
            }
            List<LoaderError> errors;
            try {
                errors = primaryDsl
                        .loadInto(table)
                        .bulkAfter(bulkSize)
                        .commitNone()
                        .loadRecords(records)
                        .fields(table.fields())
                        .execute()
                        .errors();
                success = errors.isEmpty();
                if (!errors.isEmpty()) {
                    errorCount++;
                    errors.stream()
                            .map(LoaderError::exception)
                            .filter(Objects::nonNull)
                            .forEach(err -> log.error("Error while loading data into DB", err));
                }
            } catch (IOException e) {
                throw new UncheckedIOException("bulk insert failed. table: " + table.getName(), e);
            }
        }
        if (!success) {
            // If after 100 attempts we still fail, we assume a more general problem and abort data loading
            throw new LoaderException("bulk insert failed. table: " + table.getName());
        }
        sw.stop();
        log.debug("Insert {} took {}. Attempts: {}", table.getName(), sw.getTotalTimeSeconds(), errorCount + 1);
    }

    /**
     * Determine how many facilities should be assigned to each EHR (normal dist. m: 15,000 sd: 5000) and scale it to match the total EHR count.
     * Pair::getLeft -> Facility-UUID
     * Pair::getRight -> EHR count
     *
     * @param properties
     * @param facilityNumberToUuid
     * @param ehrFacilityCountSum
     * @return
     */
    private List<MutablePair<UUID, Integer>> buildScaledFacilityToEhrDistribution(
            LoaderRequestDto properties, Map<Integer, UUID> facilityNumberToUuid, long ehrFacilityCountSum) {

        List<Pair<UUID, Double>> ehrDistribution = IntStream.range(0, properties.getHealthcareFacilities())
                .boxed()
                .map(i -> Pair.of(
                        facilityNumberToUuid.get(i), getRandomGaussianWithLimitsDouble(15_000, 5_000, 1, 30_000)))
                .collect(Collectors.toList());
        Double scaleFactor = ehrFacilityCountSum
                / ehrDistribution.parallelStream().mapToDouble(Pair::getRight).sum();
        List<MutablePair<UUID, Integer>> scaledEhrDistribution = ehrDistribution.stream()
                .map(p -> MutablePair.of(p.getKey(), (int) Math.abs(Math.round(Math.ceil(p.getValue() * scaleFactor)))))
                .sorted((i1, i2) -> -Integer.compare(i1.getRight(), i2.getRight()))
                .collect(Collectors.toList());

        // Correct for rounding/double precision errors in scaling
        long scaledSum =
                scaledEhrDistribution.stream().mapToLong(Pair::getRight).sum();
        if (scaledSum != ehrFacilityCountSum) {
            int remainder = (int) (Math.abs(scaledSum - ehrFacilityCountSum) % scaledEhrDistribution.size());
            int factor = (int) Math.abs(scaledSum - ehrFacilityCountSum) / scaledEhrDistribution.size();

            IntBinaryOperator op = scaledSum > ehrFacilityCountSum ? (i1, i2) -> i1 - i2 : Integer::sum;

            for (int i = 0; i < scaledEhrDistribution.size(); i++) {
                Pair<UUID, Integer> toReplace = scaledEhrDistribution.get(i);
                toReplace.setValue(
                        i < remainder
                                ? op.applyAsInt(op.applyAsInt(toReplace.getRight(), factor), 1)
                                : op.applyAsInt(toReplace.getRight(), factor));
            }
        }
        return scaledEhrDistribution;
    }

    /**
     * Link EHRs to be generated to concrete facilities and determine composition count for each EHR (m: 200 sd: 50).
     * Pair::getLeft -> Composition count
     * Pair::getRight -> Facility-UUIDs to use
     *
     * @param facilityNumberToUuid
     * @param ehrFacilityCounts
     * @param scaledEhrDistribution
     * @param batchSize
     * @return
     */
    private List<Pair<Integer, List<UUID>>> getEhrSettingsBatch(
            Map<Integer, UUID> facilityNumberToUuid,
            List<MutablePair<Integer, Long>> ehrFacilityCounts,
            List<MutablePair<UUID, Integer>> scaledEhrDistribution,
            int batchSize) {
        List<Pair<Integer, List<UUID>>> ehrSettings = new ArrayList<>();
        long processedCount = 0;
        // go through the facility count to number of EHRs mapping until we reach our batch-size or we run out of EHRs
        for (Pair<Integer, Long> ehrFacilityCount : ehrFacilityCounts) {
            // if we already have enough EHRs for this facility count skip it
            if (ehrFacilityCount.getRight() < 1) continue;
            long count = Math.min(batchSize - processedCount, ehrFacilityCount.getRight());

            for (int c = 0; c < count; c++) {
                // determine the facilities to use
                List<UUID> facilities = new ArrayList<>(ehrFacilityCount.getLeft());
                for (int f = 0; f < ehrFacilityCount.getLeft(); f++) {
                    if (f >= scaledEhrDistribution.size()) {
                        // Fallback if there are not enough facilities left
                        // This shifts the distribution a bit, but in reality the distribution will not be perfect
                        // anyway
                        facilityNumberToUuid.entrySet().stream()
                                .filter(p -> !facilities.contains(p.getValue()))
                                .min((i1, i2) -> -Integer.compare(i1.getKey(), i2.getKey()))
                                .map(Entry::getValue)
                                .ifPresent(facilities::add);
                    } else {
                        MutablePair<UUID, Integer> facilityWithCount = scaledEhrDistribution.get(f);
                        facilities.add(facilityWithCount.getLeft());
                        facilityWithCount.setValue(facilityWithCount.getRight() - 1);
                    }
                }
                scaledEhrDistribution.removeIf(p -> p.getRight() == 0);
                // Determine how many compositions this EHR shall hold according to a normal distribution (m: 200,
                // sd:50)
                ehrSettings.add(Pair.of((int) getRandomGaussianWithLimitsLong(200, 50, 50, 350), facilities));
            }

            ehrFacilityCount.setValue(ehrFacilityCount.getValue() - count);
            processedCount += count;
            if (processedCount == batchSize) break;
        }
        return ehrSettings;
    }

    private Pair<Integer, UUID> insertHealthcareFacility(int number) {
        PartyIdentifiedRecord record = DataCreator.createPartyWithRef(
                primaryDsl, "hcf" + number, "facilities", "ORGANISATION", PartyType.party_identified);
        record.store();
        return Pair.of(number, record.getId());
    }

    private UUID getSystemId() {
        var system = secondaryDsl.fetchOne(SYSTEM);
        if (system == null) {
            system = secondaryDsl.newRecord(SYSTEM);
            system.setDescription("Default system");
            system.setSettings("local.ehrbase.org");
            system.store();
        }
        return system.getId();
    }

    private UUID getCommitterId() {
        var committerRecord =
                secondaryDsl.fetchOne(PARTY_IDENTIFIED, PARTY_IDENTIFIED.NAME.eq("EHRbase Internal Test Data Loader"));

        if (committerRecord == null) {
            committerRecord = secondaryDsl.newRecord(PARTY_IDENTIFIED);
            committerRecord.setName("EHRbase Internal Test Data Loader");
            committerRecord.setPartyRefValue(UUID.randomUUID().toString());
            committerRecord.setPartyRefScheme("DEMOGRAPHIC");
            committerRecord.setPartyRefNamespace("User");
            committerRecord.setPartyRefType("PARTY");
            committerRecord.setPartyType(PartyType.party_identified);
            committerRecord.setObjectIdType(PartyRefIdType.generic_id);
            committerRecord.store();

            var identifierRecord = secondaryDsl.newRecord(Identifier.IDENTIFIER);
            identifierRecord.setIdValue("Test Data Loader");
            identifierRecord.setIssuer("EHRbase");
            identifierRecord.setAssigner("EHRbase");
            identifierRecord.setTypeName("EHRbase Security Authentication User");
            identifierRecord.setParty(committerRecord.getId());
            secondaryDsl.insertInto(Identifier.IDENTIFIER).set(identifierRecord).execute();
        }
        return committerRecord.getId();
    }

    private void createTemplate(String templateId, Resource file) throws IOException {
        var existingTemplateStore =
                secondaryDsl.fetchOptional(TEMPLATE_STORE, TEMPLATE_STORE.TEMPLATE_ID.eq(templateId));

        if (existingTemplateStore.isPresent()) {
            log.info("Template {} already exists", templateId);
        } else {
            var templateStoreRecord = secondaryDsl.newRecord(TEMPLATE_STORE);
            templateStoreRecord.setId(UUID.randomUUID());
            templateStoreRecord.setTemplateId(templateId);
            try (InputStream in = file.getInputStream()) {
                templateStoreRecord.setContent(IOUtils.toString(in, StandardCharsets.UTF_8));
            }
            templateStoreRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
            templateStoreRecord.store();
        }
    }
}
