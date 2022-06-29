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
package org.ehrbase.webtester.service;

import static org.ehrbase.jooq.pg.Tables.COMPOSITION_HISTORY;
import static org.ehrbase.jooq.pg.Tables.ENTRY_HISTORY;
import static org.ehrbase.jooq.pg.Tables.EVENT_CONTEXT_HISTORY;
import static org.ehrbase.jooq.pg.Tables.PARTICIPATION_HISTORY;
import static org.ehrbase.jooq.pg.Tables.PARTY_IDENTIFIED;
import static org.ehrbase.jooq.pg.Tables.STATUS_HISTORY;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nedap.archie.json.JacksonUtil;
import com.nedap.archie.rm.composition.AdminEntry;
import com.nedap.archie.rm.composition.CareEntry;
import com.nedap.archie.rm.composition.Composition;
import com.nedap.archie.rm.composition.EventContext;
import com.nedap.archie.rm.composition.Section;
import com.nedap.archie.rm.datatypes.CodePhrase;
import com.nedap.archie.rm.datavalues.DvCodedText;
import com.nedap.archie.rm.datavalues.DvText;
import com.nedap.archie.rm.datavalues.TermMapping;
import com.nedap.archie.rm.support.identification.TerminologyId;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAccessor;
import java.util.AbstractMap;
import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.function.BiFunction;
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
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.tuple.MutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.ehrbase.jooq.pg.Indexes;
import org.ehrbase.jooq.pg.enums.ContributionChangeType;
import org.ehrbase.jooq.pg.enums.ContributionDataType;
import org.ehrbase.jooq.pg.enums.ContributionState;
import org.ehrbase.jooq.pg.enums.EntryType;
import org.ehrbase.jooq.pg.enums.PartyRefIdType;
import org.ehrbase.jooq.pg.enums.PartyType;
import org.ehrbase.jooq.pg.tables.Ehr;
import org.ehrbase.jooq.pg.tables.Identifier;
import org.ehrbase.jooq.pg.tables.records.AuditDetailsRecord;
import org.ehrbase.jooq.pg.tables.records.CompositionRecord;
import org.ehrbase.jooq.pg.tables.records.ContributionRecord;
import org.ehrbase.jooq.pg.tables.records.EhrRecord;
import org.ehrbase.jooq.pg.tables.records.EntryRecord;
import org.ehrbase.jooq.pg.tables.records.EventContextRecord;
import org.ehrbase.jooq.pg.tables.records.ParticipationRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.jooq.pg.tables.records.StatusRecord;
import org.ehrbase.jooq.pg.udt.records.CodePhraseRecord;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.ehrbase.serialisation.dbencoding.RawJson;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.jooq.LoaderError;
import org.jooq.Record2;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
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

    private static final String TEMPLATES_BASE = "templates/";
    private static final String[] TEMPLATES = {
        "corona_anamnese.opt",
        "ehrbase_blood_pressure.opt",
        "virologischer_befund.opt",
        "international_patient_summary.opt"
    };
    private static final String COMPOSITIONS_BASE = "compositions/";
    private static final String[] COMPOSITIONS = {
        "blood_pressure.json", "international_patient_summary.json", "corona_anamnese.json", "virologischer_befund.json"
    };
    private static final Table[] RELEVANT_TABLES = {
        PARTY_IDENTIFIED,
        SYSTEM,
        AUDIT_DETAILS,
        COMPOSITION,
        COMPOSITION_HISTORY,
        CONTRIBUTION,
        ENTRY,
        ENTRY_HISTORY,
        EVENT_CONTEXT,
        EVENT_CONTEXT_HISTORY,
        PARTICIPATION,
        PARTICIPATION_HISTORY,
        STATUS,
        STATUS_HISTORY
    };
    private static final Table[] RELEVANT_VERSIONED_TABLES = {COMPOSITION, ENTRY, EVENT_CONTEXT, PARTICIPATION, STATUS};
    private static final int BATCH_SIZE = 10;
    private static final int MAX_COMPOSITION_VERSIONS = 3;
    private static final String SYS_TRANSACTION_FIELD_NAME = "sys_transaction";
    private static final String SYS_PERIOD_FIELD_NAME = "sys_period";
    private final Logger log = LoggerFactory.getLogger(LoaderServiceImp.class);
    // Use a ThreadLocal for our SecureRandom since the generation of the distributions can not be parallelized
    // otherwise
    private final ThreadLocal<Random> random = ThreadLocal.withInitial(SecureRandom::new);
    private final List<Composition> compositions = new ArrayList<>();
    private final ObjectMapper objectMapper = JacksonUtil.getObjectMapper();
    private final RawJson rawJson = new RawJson();
    private final DSLContext dsl;
    private final Map<String, Integer> territories = new HashMap<>();

    private UUID systemId;
    private UUID committerId;
    private String zoneId;

    private boolean isRunning = false;

    public LoaderServiceImp(DSLContext dsl) {
        this.dsl = dsl;
    }

    @PostConstruct
    public void initialize() {
        zoneId = ZoneId.systemDefault().toString();
        systemId = getSystemId();
        committerId = getCommitterId();
        territories.putAll(dsl.select(TERRITORY.TWOLETTER, TERRITORY.CODE).from(TERRITORY).fetch().stream()
                .collect(Collectors.toMap(Record2::value1, Record2::value2)));

        initializeTemplates();
        initializeCompositions();
    }

    private void initializeTemplates() {
        Stream.of(TEMPLATES).map(p -> TEMPLATES_BASE + p).forEach(p -> {
            String templateId;
            try (var in = ResourceUtils.getInputStream(p); ) {
                templateId = xpath(in, "//template/template_id/value/text()");
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
            createTemplate(templateId, p);
        });
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
        Stream.of(COMPOSITIONS)
                .map(p -> COMPOSITIONS_BASE + p)
                .map(ResourceUtils::getContent)
                .map(p -> {
                    try {
                        return objectMapper.readValue(p, Composition.class);
                    } catch (IOException e) {
                        throw new LoaderException("Failed to read composition file", e);
                    }
                })
                .forEach(compositions::add);
    }

    @Override
    public void load(LoaderRequestDto properties) {

        if (isRunning) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "A test data loading request is currently being processed. Please try again later...");
        }

        isRunning = true;
        ForkJoinPool.commonPool().execute(() -> {
            try {
                log.info("Dropping GIN index on ehr.entry.entry...");
                dsl.execute(String.format(
                        "DROP INDEX IF EXISTS %s.%s;",
                        org.ehrbase.jooq.pg.Ehr.EHR.getName(), Indexes.GIN_ENTRY_PATH_IDX.getName()));
                log.info("Disabling all non-versioning triggers...");
                // We assume Postgres or Yugabyte as DB vendor -> disabling triggers will also disable foreign key
                // constraints
                Arrays.stream(RELEVANT_TABLES)
                        .forEach(table -> dsl.execute(String.format(
                                "ALTER TABLE %s.%s DISABLE TRIGGER ALL;",
                                org.ehrbase.jooq.pg.Ehr.EHR.getName(), table.getName())));
                Arrays.stream(RELEVANT_VERSIONED_TABLES)
                        .forEach(table -> dsl.execute(String.format(
                                "ALTER TABLE %s.%s ENABLE TRIGGER versioning_trigger;",
                                org.ehrbase.jooq.pg.Ehr.EHR.getName(), table.getName())));
                loadInternal(properties);
            } catch (RuntimeException e) {
                isRunning = false;
                throw e;
            }
            log.info("Re-enabling triggers...");
            Arrays.stream(RELEVANT_TABLES)
                    .forEach(table -> dsl.execute(String.format(
                            "ALTER TABLE %s.%s ENABLE TRIGGER ALL;",
                            org.ehrbase.jooq.pg.Ehr.EHR.getName(), table.getName())));
            log.info("Recreating GIN index on ehr.entry.entry...");
            // We use a timeout of 0 since index creation can take a long time
            dsl.query(String.format(
                            "CREATE INDEX gin_entry_path_idx ON %s.%s USING gin (%s jsonb_path_ops);",
                            org.ehrbase.jooq.pg.Ehr.EHR.getName(), ENTRY.getName(), ENTRY.ENTRY_.getName()))
                    .queryTimeout(0)
                    .execute();
            log.info("Done!");
            isRunning = false;
        });
    }

    private void loadInternal(LoaderRequestDto properties) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start("prep");

        if (properties.getHealthcareFacilities() < 1 || properties.getEhr() < properties.getHealthcareFacilities()) {
            throw new IllegalArgumentException(
                    "EHR count must be higher or equal to the number of healthcareFacilities and greater than 0");
        }

        log.info("Preparing EHR distributions...");
        // Create healthcare facilities and the assigned HCPs in Table party_identified
        Map<Integer, UUID> facilityNumberToUuid = IntStream.range(0, properties.getHealthcareFacilities())
                .parallel()
                .mapToObj(this::insertHealthcareFacility)
                .collect(Collectors.toMap(Pair::getKey, Pair::getValue));
        Map<UUID, List<UUID>> facilityIdToHcpId = insertHCPsForFacilities(facilityNumberToUuid);

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
        int batches = properties.getEhr() / BATCH_SIZE + 1;
        int lastBatchSize = properties.getEhr() % BATCH_SIZE;
        for (int batch = 0; batch < batches; batch++) {
            int batchSize = batch == batches - 1 ? lastBatchSize : BATCH_SIZE;
            if (batch == batches - 1 && batchSize < 1) {
                // if the last batch is of size 0 we don't need to build and start it
                break;
            }
            // Prepare data to insert while current insert task is running
            List<EhrCreateDescriptor> ehrDescriptors = getEhrSettingsBatch(
                            facilityNumberToUuid, facilityCountToEhrCountDistribution, scaledEhrDistribution, batchSize)
                    .stream()
                    .map(ehrInfo -> buildEhrData(ehrInfo.getRight(), ehrInfo.getLeft(), facilityIdToHcpId))
                    .collect(Collectors.toList());

            // Wait for the current insert batch to complete
            if (currentInsertTask != null) {
                waitForTaskToComplete(currentInsertTask);
                stopWatch.stop();
                log.info("Batch {} completed in {} ms", batch - 1, stopWatch.getLastTaskTimeMillis());
            }
            stopWatch.start("insert-batch" + batch);
            // Insert the already prepared batch
            currentInsertTask = insertEhrsAsync(ehrDescriptors);
        }

        // wait for the last insert batch to complete
        waitForTaskToComplete(currentInsertTask);
        if (stopWatch.isRunning()) {
            stopWatch.stop();
        }
        log.info("Last Batch completed in {} ms", stopWatch.getLastTaskTimeMillis());
        log.info("Test data loaded in {} s", stopWatch.getTotalTimeSeconds());
    }

    private Map<UUID, List<UUID>> insertHCPsForFacilities(Map<Integer, UUID> facilityNumberToUuid) {
        // Generate HCPs according to a normal distribution (m: 20 sd: 5)
        // Names are following a schema of "hcf<facilitynumber>hcp<hcp-number-in-facility>"
        Map<UUID, List<PartyIdentifiedRecord>> facilityIdToHcp = facilityNumberToUuid.entrySet().parallelStream()
                .collect(Collectors.toMap(
                        Entry::getValue, e -> IntStream.range(0, (int) getRandomGaussianWithLimitsLong(20, 5, 5, 35))
                                .mapToObj(i -> createPartyWithRef(
                                        "hcf" + e.getKey() + "hcp" + i, "hcp", "PERSON", PartyType.party_identified))
                                .collect(Collectors.toList())));

        bulkInsert(
                PARTY_IDENTIFIED,
                facilityIdToHcp.entrySet().stream().map(Entry::getValue).flatMap(List::stream));

        return facilityIdToHcp.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> e.getValue().stream()
                .map(PartyIdentifiedRecord::getId)
                .collect(Collectors.toList())));
    }

    private long getRandomGaussianWithLimitsLong(int mean, int standardDeviation, int lowerBound, int upperBound) {
        return Math.min(
                upperBound,
                Math.max(
                        lowerBound,
                        Math.round(Math.ceil(Math.abs(random.get().nextGaussian() * standardDeviation + mean)))));
    }

    private double getRandomGaussianWithLimitsDouble(int mean, int standardDeviation, int lowerBound, int upperBound) {
        return Math.min(
                upperBound, Math.max(lowerBound, Math.abs(random.get().nextGaussian() * standardDeviation + mean)));
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

    private CompletableFuture<Void> insertEhrsAsync(List<EhrCreateDescriptor> ehrDescriptors) {

        CompletableFuture<Void> noDependencyInsert = CompletableFuture.allOf(
                CompletableFuture.runAsync(() -> bulkInsert(
                                AUDIT_DETAILS, ehrDescriptors.stream().flatMap(e -> e.auditDetails.stream())))
                        .thenRunAsync(() -> bulkInsert(
                                CONTRIBUTION, ehrDescriptors.stream().flatMap(e -> e.contributions.stream()))),
                CompletableFuture.runAsync(
                        () -> bulkInsert(Ehr.EHR_, ehrDescriptors.stream().map(e -> e.ehr))),
                CompletableFuture.runAsync(() ->
                        bulkInsert(PARTY_IDENTIFIED, ehrDescriptors.stream().map(e -> e.subject))));

        // We need a fixed timestamp for version updates because ehrbase uses it for fetching related objects
        OffsetDateTime additionalVersionBaseDateTime = OffsetDateTime.now();

        // We want the entry inserts to start as early as possible since these take the longest
        CompletableFuture<Void> compositionInsert = noDependencyInsert.thenRunAsync(
                () -> bulkInsert(COMPOSITION, ehrDescriptors.stream().flatMap(e -> e.compositions.stream())));
        CompletableFuture<Void> entryInsert = CompletableFuture.allOf(ehrDescriptors.stream()
                .map(d -> d.entries.stream())
                .map(e -> compositionInsert.thenRunAsync(() -> bulkInsert(ENTRY, e)))
                .toArray(CompletableFuture[]::new));
        CompletableFuture<Void> eventContextInsert = compositionInsert
                .thenRunAsync(
                        () -> bulkInsert(EVENT_CONTEXT, ehrDescriptors.stream().flatMap(e -> e.eventContexts.stream())))
                .thenRunAsync(() ->
                        bulkInsert(PARTICIPATION, ehrDescriptors.stream().flatMap(e -> e.participations.stream())));
        CompletableFuture<Void> statusInsert = noDependencyInsert.thenRunAsync(
                () -> bulkInsert(STATUS, ehrDescriptors.stream().map(e -> e.status)));

        return CompletableFuture.allOf(
                statusInsert,
                compositionInsert.thenRunAsync(() -> updateToAddVersions(
                        COMPOSITION,
                        COMPOSITION.ID,
                        ehrDescriptors,
                        EhrCreateDescriptor::getCompositionIdStreamForVersionCount,
                        additionalVersionBaseDateTime)),
                // TODO: Maybe this can SAFELY run directly after the individual entry insert tasks
                entryInsert.thenRunAsync(() -> updateToAddVersions(
                        ENTRY,
                        ENTRY.COMPOSITION_ID,
                        ehrDescriptors,
                        EhrCreateDescriptor::getCompositionIdStreamForVersionCount,
                        additionalVersionBaseDateTime)),
                eventContextInsert.thenRunAsync(() -> updateToAddVersions(
                        EVENT_CONTEXT,
                        EVENT_CONTEXT.COMPOSITION_ID,
                        ehrDescriptors,
                        EhrCreateDescriptor::getCompositionIdStreamForVersionCount,
                        additionalVersionBaseDateTime)),
                eventContextInsert.thenRunAsync(() -> updateToAddVersions(
                        PARTICIPATION,
                        PARTICIPATION.EVENT_CONTEXT,
                        ehrDescriptors,
                        EhrCreateDescriptor::getEventCtxIdStreamForVersionCount,
                        additionalVersionBaseDateTime)));
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
            dsl.update(table)
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

    private <T extends Table<R>, R extends TableRecord<R>> void bulkInsert(T table, Stream<R> records) {
        StopWatch sw = new StopWatch();
        sw.start();
        List<LoaderError> errors;
        try {
            errors = dsl.loadInto(table)
                    .bulkAfter(200)
                    .commitNone()
                    .loadRecords(records)
                    .fields(table.fields())
                    .execute()
                    .errors();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if (!errors.isEmpty()) {
            errors.stream()
                    .map(LoaderError::exception)
                    .filter(Objects::nonNull)
                    .forEach(err -> log.error("Error while loading data into DB", err));
            throw new RuntimeException("bulk insert failed");
        }
        sw.stop();
        log.info("Insert {} took {}", table.getName(), sw.getTotalTimeSeconds());
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

    private class EhrCreateDescriptor {
        EhrRecord ehr;
        StatusRecord status;
        PartyIdentifiedRecord subject;
        List<ContributionRecord> contributions = new ArrayList<>();
        List<AuditDetailsRecord> auditDetails = new ArrayList<>();
        List<CompositionRecord> compositions = new ArrayList<>();
        List<EntryRecord> entries = new ArrayList<>();
        List<EventContextRecord> eventContexts = new ArrayList<>();
        List<ParticipationRecord> participations = new ArrayList<>();
        Map<UUID, Integer> compositionIdToVersionCount = new HashMap<>();
        Map<UUID, Integer> eventCtxIdToVersionCount = new HashMap<>();

        Stream<UUID> getCompositionIdStreamForVersionCount(int version) {
            return this.compositions.stream()
                    .map(CompositionRecord::getId)
                    .filter(id -> this.compositionIdToVersionCount.getOrDefault(id, 1) >= version);
        }

        Stream<UUID> getEventCtxIdStreamForVersionCount(int version) {
            return this.eventContexts.stream()
                    .map(EventContextRecord::getId)
                    .filter(id -> this.eventCtxIdToVersionCount.getOrDefault(id, 1) >= version);
        }
    }

    private class CompositionCreateDescriptor {
        CompositionRecord composition;
        AuditDetailsRecord compositionAudit;
        EntryRecord entry;
        EventContextRecord eventContext;
        ContributionRecord contribution;
        AuditDetailsRecord contributionAudit;
        List<ParticipationRecord> participations = new ArrayList<>();
        int versions;
    }

    private EhrCreateDescriptor buildEhrData(
            List<UUID> facilities, int compositionCount, Map<UUID, List<UUID>> facilityIdToHcpId) {
        EhrCreateDescriptor ehrDescriptor = new EhrCreateDescriptor();
        UUID ehrId = UUID.randomUUID();
        OffsetDateTime sysTransaction = OffsetDateTime.now();

        // EHR and status
        Pair<ContributionRecord, AuditDetailsRecord> statusContribution =
                createContribution(ehrId, ContributionDataType.ehr, "Create EHR_STATUS", sysTransaction);
        Triple<StatusRecord, PartyIdentifiedRecord, AuditDetailsRecord> status =
                createStatus(ehrId, statusContribution.getLeft().getId(), sysTransaction);

        ehrDescriptor.ehr = createEhr(ehrId, sysTransaction);
        ehrDescriptor.status = status.getLeft();
        ehrDescriptor.subject = status.getMiddle();
        ehrDescriptor.contributions.add(statusContribution.getLeft());
        ehrDescriptor.auditDetails.add(status.getRight());
        ehrDescriptor.auditDetails.add(statusContribution.getRight());

        // Compositions
        List<CompositionCreateDescriptor> compositions = IntStream.range(0, compositionCount)
                .parallel()
                .mapToObj(i -> buildCompositionData(
                        i,
                        ehrId,
                        this.compositions.get(i % this.compositions.size()),
                        facilityIdToHcpId.get(facilities.get(i % facilities.size())),
                        facilities.get(i % facilities.size())))
                .collect(Collectors.toList());
        ehrDescriptor.compositions =
                compositions.stream().map(d -> d.composition).collect(Collectors.toList());
        ehrDescriptor.participations =
                compositions.stream().flatMap(d -> d.participations.stream()).collect(Collectors.toList());
        ehrDescriptor.auditDetails.addAll(compositions.stream()
                .flatMap(d -> Stream.of(d.compositionAudit, d.contributionAudit))
                .collect(Collectors.toList()));
        ehrDescriptor.eventContexts =
                compositions.stream().map(d -> d.eventContext).collect(Collectors.toList());
        ehrDescriptor.entries = compositions.stream().map(d -> d.entry).collect(Collectors.toList());
        ehrDescriptor.contributions.addAll(
                compositions.stream().map(d -> d.contribution).collect(Collectors.toList()));

        ehrDescriptor.compositionIdToVersionCount = compositions.stream()
                .filter(c -> c.versions > 1)
                .collect(Collectors.toMap(c -> c.composition.getId(), c -> c.versions));
        ehrDescriptor.eventCtxIdToVersionCount = compositions.stream()
                .filter(c -> c.versions > 1)
                .collect(Collectors.toMap(c -> c.eventContext.getId(), c -> c.versions));

        return ehrDescriptor;
    }

    private CompositionCreateDescriptor buildCompositionData(
            int compositionNumber, UUID ehrId, Composition compositionData, List<UUID> hcpIds, UUID facility) {

        int hcpCount = (int) getRandomGaussianWithLimitsLong(0, 1, 1, 3);
        UUID composerId = hcpIds.get(compositionNumber % hcpIds.size());

        OffsetDateTime sysTransaction = OffsetDateTime.now();

        CompositionCreateDescriptor createDescriptor = new CompositionCreateDescriptor();
        createDescriptor.versions = (int) getRandomGaussianWithLimitsLong(0, 1, 1, MAX_COMPOSITION_VERSIONS);
        Pair<ContributionRecord, AuditDetailsRecord> contribution =
                createContribution(ehrId, ContributionDataType.composition, "Create COMPOSITION", sysTransaction);
        createDescriptor.contribution = contribution.getLeft();
        createDescriptor.contributionAudit = contribution.getRight();
        Pair<CompositionRecord, AuditDetailsRecord> composition = createComposition(
                ehrId, compositionData, composerId, contribution.getLeft().getId(), sysTransaction);
        createDescriptor.composition = composition.getLeft();
        createDescriptor.compositionAudit = composition.getRight();
        createDescriptor.entry = createEntry(composition.getLeft().getId(), compositionData, sysTransaction);
        createDescriptor.eventContext = createEventContext(
                composition.getLeft().getId(), compositionData.getContext(), facility, sysTransaction);
        if (hcpCount > 1 && hcpIds.size() > 1) {
            List<UUID> participationCandidates =
                    CollectionUtils.selectRejected(hcpIds, composerId::equals, new ArrayList<>());
            IntStream.range(0, hcpCount - 1)
                    .mapToObj(i -> createHcpParticipation(
                            createDescriptor.eventContext,
                            participationCandidates.get(random.get().nextInt(participationCandidates.size())),
                            sysTransaction))
                    .forEach(createDescriptor.participations::add);
        }

        return createDescriptor;
    }

    /**
     * Creates an {@link EhrRecord}.
     */
    private EhrRecord createEhr(UUID ehrId, OffsetDateTime sysTransaction) {
        var ehrRecord = dsl.newRecord(Ehr.EHR_);
        ehrRecord.setDateCreated(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        ehrRecord.setDateCreatedTzid(zoneId);
        ehrRecord.setSystemId(systemId);
        ehrRecord.setId(ehrId);

        return ehrRecord;
    }

    /**
     * Creates an {@link StatusRecord} for the given EHR.
     */
    private Triple<StatusRecord, PartyIdentifiedRecord, AuditDetailsRecord> createStatus(
            UUID ehrId, UUID contributionId, OffsetDateTime sysTransaction) {

        AuditDetailsRecord auditDetails = createAuditDetails("Create EHR status", sysTransaction);
        PartyIdentifiedRecord patient = createPartyWithRef(null, "patients", "PERSON", PartyType.party_self);
        StatusRecord statusRecord = dsl.newRecord(STATUS);
        statusRecord.setEhrId(ehrId);
        statusRecord.setParty(patient.getId());
        statusRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        statusRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        statusRecord.setHasAudit(auditDetails.getId());
        statusRecord.setInContribution(contributionId);
        statusRecord.setArchetypeNodeId("openEHR-EHR-EHR_STATUS.generic.v1");
        statusRecord.setName(new DvCodedTextRecord("EHR Status", null, null, null, null, null));
        statusRecord.setId(UUID.randomUUID());
        statusRecord.setIsModifiable(true);
        statusRecord.setIsQueryable(true);

        return Triple.of(statusRecord, patient, auditDetails);
    }

    private PartyIdentifiedRecord createPartyWithRef(String name, String namespace, String type, PartyType partyType) {
        PartyIdentifiedRecord hcpPartyRecord = dsl.newRecord(PARTY_IDENTIFIED);
        hcpPartyRecord.setPartyRefValue(UUID.randomUUID().toString());
        hcpPartyRecord.setPartyRefScheme("id_scheme");
        hcpPartyRecord.setPartyRefNamespace(namespace);
        hcpPartyRecord.setPartyRefType(type);
        hcpPartyRecord.setName(name);
        hcpPartyRecord.setPartyType(partyType);
        hcpPartyRecord.setObjectIdType(PartyRefIdType.generic_id);
        hcpPartyRecord.setId(UUID.randomUUID());
        return hcpPartyRecord;
    }

    private Pair<Integer, UUID> insertHealthcareFacility(int number) {
        PartyIdentifiedRecord record =
                createPartyWithRef("hcf" + number, "facilities", "ORGANISATION", PartyType.party_identified);
        record.store();
        return Pair.of(number, record.getId());
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

    private void createTemplate(String templateId, String resourceLocation) {
        var existingTemplateStore = dsl.fetchOptional(TEMPLATE_STORE, TEMPLATE_STORE.TEMPLATE_ID.eq(templateId));

        if (existingTemplateStore.isPresent()) {
            log.info("Template {} already exists", templateId);
        } else {
            var templateStoreRecord = dsl.newRecord(TEMPLATE_STORE);
            templateStoreRecord.setId(UUID.randomUUID());
            templateStoreRecord.setTemplateId(templateId);
            templateStoreRecord.setContent(ResourceUtils.getContent(resourceLocation));
            templateStoreRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
            templateStoreRecord.store();
        }
    }

    /**
     * Creates a {@link CompositionRecord} for the given EHR.
     */
    private Pair<CompositionRecord, AuditDetailsRecord> createComposition(
            UUID ehrId, Composition composition, UUID composerId, UUID contributionId, OffsetDateTime sysTransaction) {
        AuditDetailsRecord auditDetails = createAuditDetails("Create COMPOSITION", sysTransaction);

        var compositionRecord = dsl.newRecord(COMPOSITION);
        compositionRecord.setEhrId(ehrId);
        compositionRecord.setInContribution(contributionId);
        compositionRecord.setLanguage(composition.getLanguage().getCodeString());
        compositionRecord.setTerritory(getTerritory(composition.getTerritory().getCodeString()));
        compositionRecord.setComposer(composerId);
        compositionRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        compositionRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        compositionRecord.setHasAudit(auditDetails.getId());
        // AttestationRef
        // FeederAudit
        compositionRecord.setLinks(JSONB.jsonb("[]"));
        compositionRecord.setId(UUID.randomUUID());
        return Pair.of(compositionRecord, auditDetails);
    }

    /**
     * Creates an {@link EntryRecord} for the given composition.
     */
    private EntryRecord createEntry(UUID compositionId, Composition composition, OffsetDateTime sysTransaction) {
        Assert.notNull(composition.getArchetypeDetails().getTemplateId(), "Template Id must not be null");

        EntryRecord entryRecord = dsl.newRecord(ENTRY);
        entryRecord.setCompositionId(compositionId);
        entryRecord.setSequence(0);
        entryRecord.setItemType(resolveEntryType(composition));
        entryRecord.setTemplateId(
                composition.getArchetypeDetails().getTemplateId().getValue());
        entryRecord.setArchetypeId(composition.getArchetypeNodeId());
        entryRecord.setCategory(createDvCodedText(composition.getCategory()));
        entryRecord.setEntry(JSONB.jsonb(rawJson.marshal(composition)));
        entryRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        entryRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        entryRecord.setRmVersion(composition.getArchetypeDetails().getRmVersion());
        entryRecord.setName(createDvCodedText(composition.getName()));
        entryRecord.setId(UUID.randomUUID());

        return entryRecord;
    }

    /**
     * Creates an {@link EventContextRecord} for the given composition.
     */
    private EventContextRecord createEventContext(
            UUID compositionId, EventContext eventContext, UUID facilityId, OffsetDateTime sysTransaction) {
        var eventContextRecord = dsl.newRecord(EVENT_CONTEXT);
        eventContextRecord.setCompositionId(compositionId);

        var startTime = eventContext.getStartTime().getValue();
        eventContextRecord.setStartTime(Timestamp.valueOf(LocalDateTime.from(startTime)));
        eventContextRecord.setStartTimeTzid(resolveTimeZone(startTime));
        eventContextRecord.setLocation(eventContext.getLocation());
        eventContextRecord.setSetting(createDvCodedText(eventContext.getSetting()));
        eventContextRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        eventContextRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        eventContextRecord.setFacility(facilityId);

        if (eventContext.getEndTime() != null) {
            var endTime = eventContext.getEndTime().getValue();
            eventContextRecord.setEndTime(Timestamp.valueOf(LocalDateTime.from(endTime)));
            eventContextRecord.setEndTimeTzid(resolveTimeZone(endTime));
        }

        if (eventContext.getOtherContext() != null
                && !CollectionUtils.isEmpty(eventContext.getOtherContext().getItems())) {
            eventContextRecord.setOtherContext(JSONB.jsonb(rawJson.marshal(eventContext.getOtherContext())));
        }

        eventContextRecord.setId(UUID.randomUUID());
        return eventContextRecord;
    }

    /**
     * Creates a {@link ParticipationRecord} for the given event context.
     *
     * @return
     */
    private ParticipationRecord createHcpParticipation(
            EventContextRecord eventCtx, UUID hcpId, OffsetDateTime sysTransaction) {
        ParticipationRecord participationRecord = dsl.newRecord(PARTICIPATION);
        participationRecord.setEventContext(eventCtx.getId());
        participationRecord.setPerformer(hcpId);
        participationRecord.setFunction(createDvCodedText(new DvText("function")));
        participationRecord.setMode(createDvCodedText(
                new DvCodedText("not specified", new CodePhrase(new TerminologyId("openehr"), "193"))));
        participationRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        participationRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        if (eventCtx.getStartTime() != null) {
            participationRecord.setTimeLower(eventCtx.getStartTime());
            participationRecord.setTimeLowerTz(eventCtx.getEndTimeTzid());
        }
        if (eventCtx.getEndTime() != null) {
            participationRecord.setTimeUpper(eventCtx.getEndTime());
            participationRecord.setTimeUpperTz(eventCtx.getEndTimeTzid());
        }
        participationRecord.setId(UUID.randomUUID());

        return participationRecord;
    }

    /**
     * Creates a {@link ContributionRecord} of the given EHR.
     */
    private Pair<ContributionRecord, AuditDetailsRecord> createContribution(
            UUID ehrId,
            ContributionDataType contributionType,
            String auditDetailsDescription,
            OffsetDateTime sysTransaction) {
        AuditDetailsRecord auditDetails = createAuditDetails(auditDetailsDescription, sysTransaction);

        ContributionRecord contributionRecord = dsl.newRecord(CONTRIBUTION);
        contributionRecord.setEhrId(ehrId);
        contributionRecord.setContributionType(contributionType);
        contributionRecord.setState(ContributionState.complete);
        contributionRecord.setHasAudit(auditDetails.getId());
        contributionRecord.setId(UUID.randomUUID());

        return Pair.of(contributionRecord, auditDetails);
    }

    /**
     * Creates an {@link AuditDetailsRecord} with the given description.
     */
    private AuditDetailsRecord createAuditDetails(String description, OffsetDateTime sysTransaction) {
        var auditDetailsRecord = dsl.newRecord(AUDIT_DETAILS);
        auditDetailsRecord.setSystemId(systemId);
        auditDetailsRecord.setCommitter(committerId);
        auditDetailsRecord.setTimeCommitted(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        auditDetailsRecord.setTimeCommittedTzid(zoneId);
        auditDetailsRecord.setChangeType(ContributionChangeType.creation);
        auditDetailsRecord.setDescription(description);
        auditDetailsRecord.setId(UUID.randomUUID());

        return auditDetailsRecord;
    }

    private DvCodedTextRecord createDvCodedText(DvText dvText) {
        if (dvText == null) {
            return null;
        }

        var dvCodedTextRecord = new DvCodedTextRecord();
        dvCodedTextRecord.setValue(dvText.getValue());
        dvCodedTextRecord.setFormatting(dvText.getFormatting());
        dvCodedTextRecord.setLanguage(createCodePhrase(dvText.getLanguage()));
        dvCodedTextRecord.setEncoding(createCodePhrase(dvText.getEncoding()));
        dvCodedTextRecord.setTermMapping(createTermMappings(dvText.getMappings()));

        if (dvText instanceof DvCodedText) {
            dvCodedTextRecord.setDefiningCode(createCodePhrase(((DvCodedText) dvText).getDefiningCode()));
        }

        return dvCodedTextRecord;
    }

    private CodePhraseRecord createCodePhrase(CodePhrase codePhrase) {
        if (codePhrase == null) {
            return null;
        }
        return new CodePhraseRecord(codePhrase.getTerminologyId().getValue(), codePhrase.getCodeString());
    }

    private String[] createTermMappings(List<TermMapping> termMappings) {
        if (CollectionUtils.isEmpty(termMappings)) {
            return new String[0];
        }

        return termMappings.stream()
                .map(termMapping -> {
                    var purpose = Optional.of(termMapping).map(TermMapping::getPurpose);
                    return Stream.of(
                                    Character.toString(termMapping.getMatch()),
                                    purpose.map(DvCodedText::getValue).orElse(""),
                                    purpose.map(DvCodedText::getDefiningCode)
                                            .map(CodePhrase::getTerminologyId)
                                            .map(TerminologyId::getValue)
                                            .orElse(""),
                                    purpose.map(DvCodedText::getDefiningCode)
                                            .map(CodePhrase::getCodeString)
                                            .orElse(""),
                                    termMapping.getTarget().getTerminologyId().getValue(),
                                    termMapping.getTarget().getCodeString())
                            .collect(Collectors.joining("|"));
                })
                .toArray(String[]::new);
    }

    private Integer getTerritory(String code) {
        return Optional.ofNullable(territories.get(code))
                .orElseThrow(() -> new IllegalArgumentException("Territory " + code + " not found"));
    }

    private EntryType resolveEntryType(Composition composition) {
        if (CollectionUtils.isEmpty(composition.getContent())) {
            return EntryType.proxy; // FIXME: not sure which value to return
        }

        var contentItem = composition.getContent().get(0);
        if (contentItem instanceof AdminEntry) {
            return EntryType.admin;
        } else if (contentItem instanceof CareEntry) {
            return EntryType.care_entry;
        } else if (contentItem instanceof Section) {
            return EntryType.section;
        } else {
            return EntryType.proxy; // FIXME: not sure which value to return
        }
    }

    private String resolveTimeZone(TemporalAccessor temporal) {
        if (temporal == null) {
            return null;
        }

        if (temporal instanceof ZonedDateTime) {
            return ((ZonedDateTime) temporal).getZone().toString();
        } else if (temporal instanceof OffsetDateTime) {
            return ((OffsetDateTime) temporal).getOffset().toString();
        } else {
            return zoneId;
        }
    }
}
