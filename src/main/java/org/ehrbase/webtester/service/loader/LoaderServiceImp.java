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

import static org.ehrbase.jooq.pg.Tables.EHR_;
import static org.ehrbase.jooq.pg.Tables.PARTY_IDENTIFIED;
import static org.ehrbase.jooq.pg.Tables.SYSTEM;
import static org.ehrbase.jooq.pg.tables.AuditDetails.AUDIT_DETAILS;
import static org.ehrbase.jooq.pg.tables.Composition.COMPOSITION;
import static org.ehrbase.jooq.pg.tables.Contribution.CONTRIBUTION;
import static org.ehrbase.jooq.pg.tables.Entry.ENTRY;
import static org.ehrbase.jooq.pg.tables.EventContext.EVENT_CONTEXT;
import static org.ehrbase.jooq.pg.tables.Participation.PARTICIPATION;
import static org.ehrbase.jooq.pg.tables.Status.STATUS;
import static org.ehrbase.jooq.pg.tables.TemplateStore.TEMPLATE_STORE;
import static org.ehrbase.jooq.pg.tables.Territory.TERRITORY;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nedap.archie.json.JacksonUtil;
import com.nedap.archie.rm.composition.Composition;
import com.zaxxer.hikari.HikariDataSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.PrimitiveIterator.OfInt;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.function.IntBinaryOperator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.MutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.apache.xmlbeans.XmlException;
import org.ehrbase.jooq.pg.enums.PartyRefIdType;
import org.ehrbase.jooq.pg.enums.PartyType;
import org.ehrbase.jooq.pg.tables.Ehr;
import org.ehrbase.jooq.pg.tables.Identifier;
import org.ehrbase.jooq.pg.tables.records.EntryRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.serialisation.dbencoding.RawJson;
import org.ehrbase.serialisation.matrixencoding.MatrixFormat;
import org.ehrbase.serialisation.matrixencoding.Row;
import org.ehrbase.webtester.service.loader.creators.CompositionDataMode;
import org.ehrbase.webtester.service.loader.creators.DataCreator;
import org.ehrbase.webtester.service.loader.creators.EhrCreateDescriptor;
import org.ehrbase.webtester.service.loader.creators.EhrCreator;
import org.ehrbase.webtester.service.loader.jooq.Encoding;
import org.ehrbase.webtester.service.loader.jooq.EncodingRecord;
import org.ehrbase.webtester.service.loader.jooq.Entry2;
import org.ehrbase.webtester.service.loader.jooq.Entry2Record;
import org.jooq.DSLContext;
import org.jooq.LoaderError;
import org.jooq.Record2;
import org.jooq.SQLDialect;
import org.jooq.Table;
import org.jooq.TableRecord;
import org.jooq.impl.DSL;
import org.openehr.schemas.v1.OPERATIONALTEMPLATE;
import org.openehr.schemas.v1.TemplateDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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

/**
 * @author Renaud Subiger
 * @since 1.0
 */
@Service
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "true")
public class LoaderServiceImp implements LoaderService {

    private static final String TEMPLATES_BASE = "classpath*:templates/**";
    private static final String COMPOSITIONS_REPEATABLE_PATH = "classpath*:compositions/repeatable/**";
    private static final String COMPOSITIONS_SINGLE_PATH = "classpath*:compositions/single/**";
    private static final int JSONB_INSERT_BATCH_SIZE = 1000;
    private final Logger log = LoggerFactory.getLogger(LoaderServiceImp.class);
    private final Map<String, OPERATIONALTEMPLATE> templates = new HashMap<>();
    private final List<CachedComposition> singleCompositions = new ArrayList<>();
    private final List<List<CachedComposition>> compositionsWithSequenceByType = new ArrayList<>();
    private final ObjectMapper objectMapper = JacksonUtil.getObjectMapper();
    private final RawJson rawJson = new RawJson();
    private final DSLContext dsl;
    private final HikariDataSource primaryDataSource;
    private final HikariDataSource secondaryDataSource;
    private final ResourceLoader resourceLoader;
    private final SQLDialect dialect;
    private final boolean keepIndexes;
    private final boolean dbAdmin;
    private final int matrixThreadCount;
    private final LoaderStateService loaderStateService;

    private InMemoryEncoder encoder;
    private EhrCreator ehrCreator;
    private boolean isRunning = false;

    public LoaderServiceImp(
            DSLContext dsl,
            ResourceLoader resourceLoader,
            @Qualifier("primaryDataSource") HikariDataSource primaryDataSource,
            @Qualifier("secondaryDataSource") HikariDataSource secondaryDataSource,
            @Value("${spring.jooq.sql-dialect}") String sqlDialect,
            @Value("${loader.keep-indexes}") boolean keepIndexes,
            @Value("${loader.db-admin}") boolean dbAdmin,
            @Value("${loader.matrix-insert-threads:10}") int matrixThreadCount,
            LoaderStateService loaderStateService) {
        this.dsl = dsl;
        this.secondaryDataSource = secondaryDataSource;
        this.primaryDataSource = primaryDataSource;
        this.resourceLoader = resourceLoader;
        this.dialect = SQLDialect.valueOf(sqlDialect);
        this.keepIndexes = keepIndexes;
        this.dbAdmin = dbAdmin;
        this.matrixThreadCount = matrixThreadCount;
        this.loaderStateService = loaderStateService;
    }

    @PostConstruct
    public void initialize() {
        System.setProperty(
                "javax.xml.parsers.DocumentBuilderFactory",
                "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
        initializeTemplates();
        Map<String, Long> existingEncodings =
                dsl.select().from(Encoding.ENCODING).fetchMap(Encoding.ENCODING.PATH, Encoding.ENCODING.CODE);
        encoder = new InMemoryEncoder(existingEncodings);
        initializeCompositions();
        List<EncodingRecord> encodingsToInsert = encoder.getPathToCodeMap().entrySet().stream()
                .filter(e -> !existingEncodings.containsKey(e.getKey()))
                .map(e -> {
                    EncodingRecord record = dsl.newRecord(Encoding.ENCODING);
                    record.setCode(e.getValue());
                    record.setPath(e.getKey());
                    return record;
                })
                .collect(Collectors.toList());
        if (!encodingsToInsert.isEmpty()) {
            bulkInsert(Encoding.ENCODING, encodingsToInsert.stream(), 20000);
            Long currentCode = encoder.getCodeToPathMap().keySet().stream()
                    .max(Long::compareTo)
                    .map(l -> l + 1)
                    .orElse(1L);
            // We need to set the current sequence value to max(codes) + 1 to avoid conflicts
            runStatementWithTransactionalWrites(
                    "ALTER SEQUENCE ehr.encoding_code_seq RESTART WITH " + currentCode + ";");
        }
        ehrCreator = new EhrCreator(
                dsl,
                ZoneId.systemDefault().toString(),
                getSystemId(),
                getCommitterId(),
                dsl.select(TERRITORY.TWOLETTER, TERRITORY.CODE).from(TERRITORY).fetch().stream()
                        .collect(Collectors.toMap(Record2::value1, Record2::value2)),
                singleCompositions,
                compositionsWithSequenceByType,
                encoder.getPathToCodeMap().entrySet().stream()
                        .collect(Collectors.toUnmodifiableMap(
                                Map.Entry::getKey, e -> "/" + e.getValue().toString())));
        if (!Set.of(LoaderPhase.NOT_RUN, LoaderPhase.FINISHED).contains(loaderStateService.getCurrentPhase())) {
            load(null);
        }
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
            MatrixFormat matrixFormat =
                    new MatrixFormat(templateId -> Optional.of(templateId).map(templates::get), encoder);
            final OfInt sequenceNumIterator = IntStream.iterate(0, i -> i + 1).iterator();
            Map<Integer, List<CachedComposition>> compByGroup = Arrays.stream(
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
                                    p -> new CachedComposition(
                                            sequenceNumIterator.next(),
                                            p.getRight(),
                                            rawJson.marshal(p.getRight()),
                                            matrixFormat.toTable(p.getRight()).stream()
                                                    .map(this::toRowDataPair)
                                                    .collect(Collectors.toList())),
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
                            return new CachedComposition(
                                    sequenceNumIterator.next(),
                                    composition,
                                    rawJson.marshal(composition),
                                    matrixFormat.toTable(composition).stream()
                                            .map(this::toRowDataPair)
                                            .collect(Collectors.toList()));
                        } catch (IOException e) {
                            throw new LoaderException("Failed to read composition file", e);
                        }
                    })
                    .forEach(singleCompositions::add);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private Pair<Row, Map<String, Object>> toRowDataPair(Row r) {
        try {
            return Pair.of(
                    r,
                    objectMapper.readValue(
                            MatrixFormat.MAPPER.writeValueAsString(r.getFields()), new TypeReference<>() {}));
        } catch (JsonProcessingException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Override
    public void load(LoaderRequestDto settings) {

        if (isRunning) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "A test data loading request is currently being processed. Please try again later...");
        }

        if (settings != null
                && (settings.getHealthcareFacilities() < 1 || settings.getEhr() < settings.getHealthcareFacilities())) {
            throw new IllegalArgumentException(
                    "EHR count must be higher or equal to the number of healthcareFacilities and greater than 0");
        }

        final LoaderPhase currentPhase = loaderStateService.getCurrentPhase();
        final LoaderRequestDto properties;
        if (settings == null) {
            if (LoaderPhase.PRE_LOAD.equals(currentPhase)) {
                throw new LoaderException("Can't resume during PRE_LOAD phase. Please reinitialize the DB!");
            }
            properties = loaderStateService.getSettingsFromDB();
            if (LoaderPhase.PHASE_1.equals(currentPhase)) {
                log.warn(
                        "Resuming during PHASE_1. A manual cleanup may be necessary afterwards. Check the logs of the previous run to see which tables might need cleanup.");
                properties.setEhr(properties.getEhr() - (getEhrCount() - loaderStateService.getPreviousEHRCount()));
            }
        } else if (!Set.of(LoaderPhase.NOT_RUN, LoaderPhase.FINISHED).contains(currentPhase)) {
            throw new LoaderException("Last execution was interrupted. Please resume instead of starting a new run!");
        } else {
            properties = settings;
        }

        isRunning = true;
        ForkJoinPool.commonPool().execute(() -> {
            try {
                if (currentPhase.ordinal() <= LoaderPhase.PRE_LOAD.ordinal()) {
                    preLoadOperations(properties);
                }
                if (currentPhase.ordinal() <= LoaderPhase.PHASE_1.ordinal()) {
                    insertEhrData(properties);
                }
                if (currentPhase.ordinal() <= LoaderPhase.PHASE_2.ordinal()
                        && properties.getModes().contains(CompositionDataMode.LEGACY)) {
                    copyToEntryWithJsonb();
                }
                if (currentPhase.ordinal() <= LoaderPhase.POST_LOAD.ordinal()) {
                    postLoadOperations(properties);
                }

                loaderStateService.updateCurrentLoaderPhase(LoaderPhase.FINISHED);
            } catch (RuntimeException e) {
                isRunning = false;
                throw e;
            }
            isRunning = false;
            log.info("Done!");
        });
    }

    @Override
    public ExecutionState isRunning() {
        LoaderPhase currentPhase = loaderStateService.getCurrentPhase();
        return new ExecutionState(!isRunning, currentPhase, LoaderPhase.FINISHED.equals(currentPhase));
    }

    private int getEhrCount() {
        return dsl.fetchCount(EHR_);
    }

    private List<String> getTableNames() {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            List<String> tableNames = new ArrayList<>();
            try (ResultSet resultSet = s.executeQuery("SELECT tablename FROM pg_tables WHERE schemaname='ehr';")) {
                while (resultSet.next()) {
                    tableNames.add(resultSet.getString(1));
                }
            }
            return tableNames;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
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

    private List<IndexInfo> findIndexes(LoaderRequestDto properties, List<Constraint> constraints) {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            s.execute(String.format(
                    "SELECT schemaname, indexname, indexdef\n" + "FROM pg_indexes\n"
                            + "WHERE schemaname = 'ehr'"
                            + "AND indexname NOT IN (%s)",
                    constraints.stream()
                            .map(t -> "'" + t.getConstraintName() + "'")
                            .collect(Collectors.joining(","))));
            List<IndexInfo> parsed = new ArrayList<>();
            try (ResultSet resultSet = s.getResultSet()) {
                while (resultSet.next()) {
                    parsed.add(new IndexInfo(
                            resultSet.getString(1),
                            resultSet.getString(2),
                            SQLDialect.YUGABYTEDB.equals(dialect) && properties.isRecreateIndexesNonConcurrently()
                                    ?
                                    // For yugabyte we use nonconcurrent index creation to avoid leaving broken indexes
                                    // behind
                                    resultSet.getString(3).replace("INDEX", "INDEX NONCONCURRENTLY IF NOT EXISTS")
                                    : resultSet.getString(3).replace("INDEX", "INDEX IF NOT EXISTS")));
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

    private void preLoadOperations(LoaderRequestDto properties) {

        log.info(
                "Test data loading options [EHRs: {}, Facilities: {}, Bulk insert size {}, EHRs per batch: {}]",
                properties.getEhr(),
                properties.getHealthcareFacilities(),
                properties.getBulkSize(),
                properties.getEhrsPerBatch());

        loaderStateService.updateCurrentLoaderPhase(LoaderPhase.PRE_LOAD);

        log.info("Starting PRE_LOAD...");

        List<Constraint> constraints = findConstraints();
        List<IndexInfo> indexes = findIndexes(properties, constraints);
        List<String> tableNames = getTableNames();
        List<String> tmpTableNames =
                properties.getModes().contains(CompositionDataMode.LEGACY) ? prepareEntryTables() : new ArrayList<>();

        // Save info required for resuming in DB
        loaderStateService.updateUniqueConstraints(constraints.stream()
                .filter(cs -> "u".equalsIgnoreCase(cs.getType()))
                .collect(Collectors.toList()));
        loaderStateService.updateIndexInfo(indexes);
        loaderStateService.updateTableNames(tableNames);
        loaderStateService.updateTemporaryTableNames(tmpTableNames);
        loaderStateService.updateLoaderSettings(properties);
        loaderStateService.updatePreviousEHRCount(getEhrCount());

        if (!keepIndexes) {
            log.info("Dropping indexes (including unique constraints) on relevant tables: {}", tableNames);
            constraints.stream()
                    .filter(cs -> "u".equalsIgnoreCase(cs.getType()))
                    .forEach(cs -> runStatementWithTransactionalWrites(String.format(
                            "ALTER TABLE %s.%s DROP CONSTRAINT IF EXISTS %s;",
                            cs.getSchema(), cs.getTable(), cs.getConstraintName())));
            indexes.forEach(indexInfo -> runStatementWithTransactionalWrites(
                    String.format("DROP INDEX IF EXISTS %s.%s;", indexInfo.getSchema(), indexInfo.getName())));
        }

        if (dbAdmin) {
            log.info("Disabling all triggers...");
            // We assume Postgres or Yugabyte as DB vendor -> disabling triggers will also disable foreign key
            // constraints
            tableNames.forEach(table -> runStatementWithTransactionalWrites(String.format(
                    "ALTER TABLE %s.%s DISABLE TRIGGER ALL;", org.ehrbase.jooq.pg.Ehr.EHR.getName(), table)));
            tmpTableNames.forEach(table -> runStatementWithTransactionalWrites(String.format(
                    "ALTER TABLE %s.%s DISABLE TRIGGER ALL;", org.ehrbase.jooq.pg.Ehr.EHR.getName(), table)));
        }
    }

    private void insertEhrData(LoaderRequestDto properties) {

        loaderStateService.updateCurrentLoaderPhase(LoaderPhase.PHASE_1);

        log.info("Starting PHASE_1...");

        StopWatch stopWatch = new StopWatch();
        stopWatch.start("prep");

        log.info("Preparing EHR distributions...");
        // Create healthcare facilities and the assigned HCPs in Table party_identified
        Map<Integer, Pair<UUID, String>> facilityNumberToUuid = IntStream.range(0, properties.getHealthcareFacilities())
                .parallel()
                .mapToObj(this::insertHealthcareFacility)
                .collect(Collectors.toMap(Pair::getKey, Pair::getValue));
        Map<UUID, String> facilityIdToName =
                facilityNumberToUuid.values().stream().collect(Collectors.toMap(Pair::getKey, Pair::getValue));
        Map<UUID, List<Pair<UUID, String>>> facilityIdToHcp =
                insertHCPsForFacilities(facilityNumberToUuid, properties.getBulkSize());

        /* Determine how many facilities should be assigned to each EHR (normal dist. m: 7 sd: 3)
        This Step will take a while for high EHR counts (i.e. 10,000,000) since the random number generation is
        synchronized */
        List<MutablePair<Integer, Long>> facilityCountToEhrCountDistribution = IntStream.range(0, properties.getEhr())
                .parallel()
                .mapToObj(e -> (int) RandomHelper.getRandomGaussianWithLimitsLong(7, 3, 1, 16))
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
                            facilityNumberToUuid,
                            facilityIdToName,
                            facilityCountToEhrCountDistribution,
                            scaledEhrDistribution,
                            batchSize)
                    .stream()
                    .map(ehrInfo -> ehrCreator.create(new EhrCreator.EhrCreationInfo(
                            ehrInfo.getRight(), ehrInfo.getLeft(), facilityIdToHcp, properties.getModes())))
                    .collect(Collectors.toList());

            // Wait for the current insert batch to complete
            if (currentInsertTask != null) {
                waitForTaskToComplete(currentInsertTask);
                stopWatch.stop();
                log.info("Batch {} completed in {} ms", batch - 1, stopWatch.getLastTaskTimeMillis());
            }
            stopWatch.start("insert-batch" + batch);
            // Insert the already prepared batch
            currentInsertTask = insertEhrsAsync(ehrDescriptors, properties);
        }

        // wait for the last insert batch to complete
        waitForTaskToComplete(currentInsertTask);
        if (stopWatch.isRunning()) {
            stopWatch.stop();
        }
        log.info("Last Batch completed in {} ms", stopWatch.getLastTaskTimeMillis());
        log.info("Test data without ehr.entry.entry contents loaded in {} s", stopWatch.getTotalTimeSeconds());
    }

    private void copyToEntryWithJsonb() {

        loaderStateService.updateCurrentLoaderPhase(LoaderPhase.PHASE_2);

        log.info("Starting PHASE_2...");

        StopWatch stopWatch = new StopWatch();
        log.info("Copying to ehr.entry with JSONB data...");
        stopWatch.start("count");
        List<Pair<CachedComposition, Long>> compositionsWithCount = Stream.concat(
                        singleCompositions.stream(),
                        compositionsWithSequenceByType.stream().flatMap(List::stream))
                .parallel()
                .map(c -> Pair.of(c, entryTableSize(c.getIdx())))
                .collect(Collectors.toList());
        stopWatch.stop();
        log.info("Getting temporary entry table sizes took {}ms", stopWatch.getLastTaskTimeMillis());

        stopWatch.start("move-entries");
        waitForTaskToComplete(CompletableFuture.allOf(compositionsWithCount.stream()
                .map(ci -> CompletableFuture.runAsync(() -> copyIntoEntryTableWithJsonb(
                        ci.getRight(), ci.getLeft().getIdx(), ci.getLeft().getEntryJsonb())))
                .toArray(CompletableFuture[]::new)));
        stopWatch.stop();
        log.info("Moved entry data and added JSONB in {}s", stopWatch.getTotalTimeSeconds());
    }

    private void postLoadOperations(LoaderRequestDto properties) {

        loaderStateService.updateCurrentLoaderPhase(LoaderPhase.POST_LOAD);

        log.info("Starting POST_LOAD...");
        StopWatch sw = new StopWatch();
        sw.start();
        final List<String> failedStatements = new ArrayList<>();
        // All streams are explicitly marked as sequential since parallel catalog updates may lead to conflicts
        if (dbAdmin) {
            log.info("Re-enabling triggers...");
            loaderStateService.getTableNamesFromDB().stream()
                    .sequential()
                    .map(table -> String.format(
                            "ALTER TABLE %s.%s ENABLE TRIGGER ALL;", org.ehrbase.jooq.pg.Ehr.EHR.getName(), table))
                    .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));
        }
        if (!keepIndexes) {
            log.info("Re-Creating indexes...");
            // The index statements are modified to include IF NOT EXISTS when the job is started first
            loaderStateService.getIndexInfoFromDB().stream()
                    .sequential()
                    .filter(i -> !"gin_entry_path_idx".equalsIgnoreCase(i.getName()))
                    .map(IndexInfo::getDdl)
                    .map(s -> s + ";")
                    .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));

            log.info("Re-Creating unique constraints...");
            // We make sure that we do not try to add constraints that already exist
            Set<String> constraints = findConstraints().stream()
                    .map(Constraint::getConstraintName)
                    .collect(Collectors.toSet());
            loaderStateService.getUniqueConstraintsFromDB().stream()
                    .sequential()
                    .filter(cs -> "u".equalsIgnoreCase(cs.getType()))
                    .filter(cs -> !constraints.contains(cs.getConstraintName()))
                    .map(cs -> String.format(
                            "ALTER TABLE %s.%s ADD CONSTRAINT %s %s;",
                            cs.getSchema(), cs.getTable(), cs.getConstraintName(), cs.getDefinition()))
                    .forEach(s -> runStatementWithTransactionalWrites(s, failedStatements));
        }
        if (properties.getModes().contains(CompositionDataMode.LEGACY)) {
            log.info("Removing temporary entry tables...");
            loaderStateService
                    .getTemporaryTableNamesFromDB()
                    .forEach(i -> runStatementWithTransactionalWrites(
                            String.format("DROP TABLE IF EXISTS ehr.%s;", i), failedStatements));
        }

        List<String> errorsAfterRetry = retryStatements(failedStatements);
        sw.stop();
        log.info("Post load operations took {}s", sw.getTotalTimeSeconds());

        if (!errorsAfterRetry.isEmpty()) {
            log.error(
                    "The following post load SQL statements failed. Please run them manually: \n {}",
                    String.join("\n", failedStatements));
        }
        log.info("GIN index on ehr.entry.entry will not be recreated automatically, "
                + "because it is a very long running operation. \n"
                + "Please add it manually! Statement: \n"
                + "CREATE INDEX gin_entry_path_idx ON ehr.entry USING gin (entry jsonb_path_ops);");
    }

    private List<String> retryStatements(List<String> statements) {
        if (statements.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> toRetry = new ArrayList<>(statements);
        for (int i = 0; i < 10; i++) {
            List<String> errors = new ArrayList<>();
            toRetry.forEach(s -> {
                try {
                    // We wait 30s to avoid overloading the DB
                    Thread.sleep(30000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(e);
                }
                runStatementWithTransactionalWrites(s, errors);
            });
            toRetry.retainAll(errors);
            if (errors.isEmpty()) {
                break;
            }
        }

        return toRetry;
    }

    private void copyIntoEntryTableWithJsonb(long tableSize, int compositionNumber, String jsonbData) {

        if (tableSize < 1L) {
            // if our table is empty we do not need to run anything
            log.info("Skipping composition {}, because the source table is empty", compositionNumber);
            return;
        }
        // We add one additional iteration for the leftovers
        long loops = (tableSize / JSONB_INSERT_BATCH_SIZE) + 1;
        log.info("Comp {} count: {}, batches: {}", compositionNumber, tableSize, loops);
        int errorCount = 0;

        StopWatch sw = new StopWatch();
        for (long i = 0; i < loops; i++) {
            sw.start("batch" + i);
            try {
                Triple<Integer, Long, Long> insertResult =
                        copyBatchIntoEntryTableWithJsonb(compositionNumber, jsonbData);
                sw.stop();
                log.info(
                        "Copy comp {} batch: {}, count: {}, connection time: {}ms, execution time: {}ms, total time: {}ms",
                        compositionNumber,
                        i - errorCount,
                        insertResult.getLeft(),
                        insertResult.getMiddle(),
                        insertResult.getRight(),
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

    private Triple<Integer, Long, Long> copyBatchIntoEntryTableWithJsonb(int compositionNumber, String jsonbData)
            throws SQLException {
        StopWatch sw = new StopWatch();
        sw.start("connection");
        try (Connection c = primaryDataSource.getConnection()) {
            sw.stop();
            long connectionTime = sw.getLastTaskTimeMillis();
            sw.start("execution");
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
                        compositionNumber, compositionNumber, JSONB_INSERT_BATCH_SIZE, jsonbData);
                int insertCount = s.executeUpdate(statement);
                sw.stop();
                return Triple.of(insertCount, connectionTime, sw.getLastTaskTimeMillis());
            } catch (SQLException e) {
                // Some errors may result in a broken DB session therefore we evict the connection from the pool
                primaryDataSource.evictConnection(c);
                throw e;
            }
        }
    }

    private long entryTableSize(int compositionNumber) {
        return dsl.select(
                        DSL.aggregate("count", Long.class, ENTRY.rename(ENTRY.getName() + "_" + compositionNumber).ID))
                .from(ENTRY.rename(ENTRY.getName() + "_" + compositionNumber))
                .fetchOptional(0, Long.class)
                .orElse(0L);
    }

    private void runStatementWithTransactionalWrites(String createStatement) {
        runStatementWithTransactionalWrites(createStatement, null);
    }

    private void runStatementWithTransactionalWrites(String createStatement, List<String> errors) {
        try (Connection c = secondaryDataSource.getConnection();
                Statement s = c.createStatement()) {
            s.setQueryTimeout(0);
            log.info(createStatement);
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

    private Map<UUID, List<Pair<UUID, String>>> insertHCPsForFacilities(
            Map<Integer, Pair<UUID, String>> facilityNumberToUuid, int bulkSize) {
        // Generate HCPs according to a normal distribution (m: 20 sd: 5)
        // Names are following a schema of "hcf<facilitynumber>hcp<hcp-number-in-facility>"
        Map<UUID, List<PartyIdentifiedRecord>> facilityIdToHcp = facilityNumberToUuid.entrySet().parallelStream()
                .collect(Collectors.toMap(e -> e.getValue().getKey(), e -> IntStream.range(
                                0, (int) RandomHelper.getRandomGaussianWithLimitsLong(20, 5, 5, 35))
                        .mapToObj(i -> DataCreator.createPartyWithRef(
                                dsl, "hcf" + e.getKey() + "hcp" + i, "hcp", "PERSON", PartyType.party_identified))
                        .collect(Collectors.toList())));

        bulkInsert(PARTY_IDENTIFIED, facilityIdToHcp.values().stream().flatMap(List::stream), bulkSize);

        return facilityIdToHcp.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> e.getValue().stream()
                .map(r -> Pair.of(r.getId(), r.getName()))
                .collect(Collectors.toList())));
    }

    private void waitForTaskToComplete(CompletableFuture<Void> insertTask) {
        if (insertTask != null) {
            try {
                insertTask.get();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException(e);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private CompletableFuture<Void> insertEhrsAsync(
            List<EhrCreateDescriptor> ehrDescriptors, LoaderRequestDto properties) {
        List<CompletableFuture<Void>> tasks = new ArrayList<>();
        // The tasks are started ordered by the execution times
        if (properties.getModes().contains(CompositionDataMode.MATRIX)) {
            List<Entry2Record> matrixRecords = ehrDescriptors.stream()
                    .map(EhrCreateDescriptor::getMatrixRecords)
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
            // We add one to account for the remainder
            final int recordsPerThread = (matrixRecords.size() / matrixThreadCount) + 1;
            tasks.addAll(ListUtils.partition(matrixRecords, recordsPerThread).stream()
                    .map(e -> CompletableFuture.runAsync(
                            () -> bulkInsert(Entry2.ENTRY2, e.stream(), properties.getBulkSize() * 4)))
                    .collect(Collectors.toList()));
        }
        if (properties.getModes().contains(CompositionDataMode.LEGACY)) {
            tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                    EVENT_CONTEXT,
                    ehrDescriptors.stream().flatMap(e -> e.getEventContexts().stream()),
                    properties.getBulkSize())));
            tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                    COMPOSITION,
                    ehrDescriptors.stream().flatMap(e -> e.getCompositions().stream()),
                    properties.getBulkSize())));
        }
        tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                AUDIT_DETAILS,
                ehrDescriptors.stream().flatMap(e -> e.getAuditDetails().stream()),
                properties.getBulkSize())));
        if (properties.getModes().contains(CompositionDataMode.LEGACY)) {
            tasks.addAll(ehrDescriptors.stream()
                    .flatMap(d -> d.getEntries().stream())
                    .collect(Collectors.groupingBy(EntryRecord::getSequence))
                    .entrySet()
                    .stream()
                    .map(e -> CompletableFuture.runAsync(() -> bulkInsert(
                            ENTRY.rename(ENTRY.getName() + "_" + e.getKey()),
                            e.getValue().stream(),
                            properties.getBulkSize())))
                    .collect(Collectors.toList()));
            tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                    PARTICIPATION,
                    ehrDescriptors.stream().flatMap(e -> e.getParticipations().stream()),
                    properties.getBulkSize())));
        }
        tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                CONTRIBUTION,
                ehrDescriptors.stream().flatMap(e -> e.getContributions().stream()),
                properties.getBulkSize())));
        tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                PARTY_IDENTIFIED,
                ehrDescriptors.stream().map(EhrCreateDescriptor::getSubject),
                properties.getBulkSize())));
        tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                STATUS, ehrDescriptors.stream().map(EhrCreateDescriptor::getStatus), properties.getBulkSize())));
        tasks.add(CompletableFuture.runAsync(() -> bulkInsert(
                Ehr.EHR_, ehrDescriptors.stream().map(EhrCreateDescriptor::getEhr), properties.getBulkSize())));

        return CompletableFuture.allOf(tasks.toArray(CompletableFuture[]::new));
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
                log.info("Retrying bulk insert. table: {}, retry-attempt: {}", table.getName(), errorCount);
            }
            List<LoaderError> errors;
            try {
                errors = dsl.loadInto(table)
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
            } catch (Exception e) {
                success = false;
                errorCount++;
                if (errorCount >= 100) {
                    throw new RuntimeException(e);
                }
            }
        }
        if (!success) {
            // If after 100 attempts we still fail, we assume a more general problem and abort data loading
            throw new LoaderException("bulk insert failed. table: " + table.getName());
        }
        sw.stop();
        log.info("Insert {} took {}. Attempts: {}", table.getName(), sw.getTotalTimeSeconds(), errorCount + 1);
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
            LoaderRequestDto properties,
            Map<Integer, Pair<UUID, String>> facilityNumberToUuid,
            long ehrFacilityCountSum) {

        List<Pair<UUID, Double>> ehrDistribution = IntStream.range(0, properties.getHealthcareFacilities())
                .boxed()
                .map(i -> Pair.of(
                        facilityNumberToUuid.get(i).getLeft(),
                        RandomHelper.getRandomGaussianWithLimitsDouble(15_000, 5_000, 1, 30_000)))
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
     * @param facilityIdToName
     * @param ehrFacilityCounts
     * @param scaledEhrDistribution
     * @param batchSize
     * @return
     */
    private List<Pair<Integer, List<Pair<UUID, String>>>> getEhrSettingsBatch(
            Map<Integer, Pair<UUID, String>> facilityNumberToUuid,
            Map<UUID, String> facilityIdToName,
            List<MutablePair<Integer, Long>> ehrFacilityCounts,
            List<MutablePair<UUID, Integer>> scaledEhrDistribution,
            int batchSize) {
        List<Pair<Integer, List<Pair<UUID, String>>>> ehrSettings = new ArrayList<>();
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
                                .map(Pair::getKey)
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
                ehrSettings.add(Pair.of(
                        (int) RandomHelper.getRandomGaussianWithLimitsLong(200, 50, 50, 350),
                        facilities.stream()
                                .map(f -> Pair.of(f, facilityIdToName.get(f)))
                                .collect(Collectors.toList())));
            }

            ehrFacilityCount.setValue(ehrFacilityCount.getValue() - count);
            processedCount += count;
            if (processedCount == batchSize) break;
        }
        return ehrSettings;
    }

    private Pair<Integer, Pair<UUID, String>> insertHealthcareFacility(int number) {
        PartyIdentifiedRecord record = DataCreator.createPartyWithRef(
                dsl, "hcf" + number, "facilities", "ORGANISATION", PartyType.party_identified);
        record.store();
        return Pair.of(number, Pair.of(record.getId(), record.getName()));
    }

    private UUID getSystemId() {
        var system = dsl.fetchOne(SYSTEM);
        if (system == null) {
            system = dsl.newRecord(SYSTEM);
            system.setDescription("Default system");
            system.setSettings("local.ehrbase.org");
            system.store();
        }
        return system.getId();
    }

    private UUID getCommitterId() {
        var committerRecord =
                dsl.fetchOne(PARTY_IDENTIFIED, PARTY_IDENTIFIED.NAME.eq("EHRbase Internal Test Data Loader"));

        if (committerRecord == null) {
            committerRecord = dsl.newRecord(PARTY_IDENTIFIED);
            committerRecord.setName("EHRbase Internal Test Data Loader");
            committerRecord.setPartyRefValue(UUID.randomUUID().toString());
            committerRecord.setPartyRefScheme("DEMOGRAPHIC");
            committerRecord.setPartyRefNamespace("User");
            committerRecord.setPartyRefType("PARTY");
            committerRecord.setPartyType(PartyType.party_identified);
            committerRecord.setObjectIdType(PartyRefIdType.generic_id);
            committerRecord.store();

            var identifierRecord = dsl.newRecord(Identifier.IDENTIFIER);
            identifierRecord.setIdValue("Test Data Loader");
            identifierRecord.setIssuer("EHRbase");
            identifierRecord.setAssigner("EHRbase");
            identifierRecord.setTypeName("EHRbase Security Authentication User");
            identifierRecord.setParty(committerRecord.getId());
            dsl.insertInto(Identifier.IDENTIFIER).set(identifierRecord).execute();
        }
        return committerRecord.getId();
    }

    private void createTemplate(String templateId, Resource file) throws IOException {
        var existingTemplateStore = dsl.fetchOptional(TEMPLATE_STORE, TEMPLATE_STORE.TEMPLATE_ID.eq(templateId));
        String tpl;
        try (InputStream in = file.getInputStream()) {
            tpl = IOUtils.toString(in, StandardCharsets.UTF_8);
            templates.put(templateId, TemplateDocument.Factory.parse(tpl).getTemplate());
        } catch (XmlException e) {
            throw new LoaderException("Failed to parse template", e);
        }
        if (existingTemplateStore.isPresent()) {
            log.info("Template {} already exists", templateId);
        } else {
            var templateStoreRecord = dsl.newRecord(TEMPLATE_STORE);
            templateStoreRecord.setId(UUID.randomUUID());
            templateStoreRecord.setTemplateId(templateId);
            templateStoreRecord.setContent(tpl);
            templateStoreRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
            templateStoreRecord.store();
        }
    }
}
