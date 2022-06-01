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
import com.nedap.archie.rm.generic.Participation;
import com.nedap.archie.rm.generic.PartyIdentified;
import com.nedap.archie.rm.generic.PartyProxy;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
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
import org.apache.commons.lang3.tuple.Pair;
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
import org.ehrbase.jooq.pg.tables.records.StatusRecord;
import org.ehrbase.jooq.pg.tables.records.TerritoryRecord;
import org.ehrbase.jooq.pg.udt.records.CodePhraseRecord;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.ehrbase.serialisation.dbencoding.RawJson;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StopWatch;
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
    private final Logger log = LoggerFactory.getLogger(LoaderServiceImp.class);

    private final Random random = new SecureRandom();
    private final List<Composition> compositions = new ArrayList<>();

    private final ObjectMapper objectMapper = JacksonUtil.getObjectMapper();
    private final RawJson rawJson = new RawJson();

    private final DSLContext dsl;

    private UUID systemId;
    private UUID committerId;
    private String zoneId;

    public LoaderServiceImp(DSLContext dsl) {
        this.dsl = dsl;
    }

    @PostConstruct
    public void initialize() {
        zoneId = ZoneId.systemDefault().toString();
        systemId = getSystemId();
        committerId = getCommitterId();

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
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        if (properties.getHealthcareFacilities() < 1 || properties.getEhr() < properties.getHealthcareFacilities()) {
            throw new IllegalArgumentException("");
        }

        log.info("Preparing EHR distributions...");

        // Create healthcare facilities in Table party_identified
        Map<Integer, UUID> facilityNumberToUuid = IntStream.range(0, properties.getHealthcareFacilities())
                .parallel()
                .mapToObj(this::insertHealthcareFacility)
                .collect(Collectors.toMap(Pair::getKey, Pair::getValue));

        // Determine how many facilities should be assigned to each EHR (normal dist. m: 7 sd: 3)
        // This Step will take a while for high EHR counts (i.e. 10,000,000) since the random number generation is
        // synchronized
        List<Integer> ehrFacilityCounts = IntStream.range(0, properties.getEhr())
                .parallel()
                .mapToObj(e -> (int) Math.max(1, Math.round(random.nextGaussian() * 3 + 7)))
                .sorted((i1, i2) -> -Integer.compare(i1, i2))
                .collect(Collectors.toList());

        // Determine how many facilities should be assigned to each EHR (normal dist. m: 15,000 sd: 5000) and scale it
        // to match the total EHR count
        Map<UUID, Double> ehrDistribution = IntStream.range(0, properties.getHealthcareFacilities())
                .boxed()
                .collect(Collectors.toMap(facilityNumberToUuid::get, i -> random.nextGaussian() * 5000 + 15000));
        Double scaleFactor = ehrFacilityCounts.parallelStream()
                        .mapToLong(i -> i)
                        .sum()
                / ehrDistribution.values().parallelStream().mapToDouble(v -> v).sum();
        List<Pair<UUID, Integer>> scaledEhrDistribution = ehrDistribution.entrySet().stream()
                .map(p -> Pair.of(p.getKey(), (int) Math.abs(Math.round(Math.ceil(p.getValue() * scaleFactor)))))
                .sorted((i1, i2) -> -Integer.compare(i1.getRight(), i2.getRight()))
                .collect(Collectors.toList());

        // Correct for rounding/double precision errors in the scaling (only for Facility-to-EHR sum > EHR-to-facility
        // sum case, to avoid unconnected facilities)
        long scaledSum =
                scaledEhrDistribution.stream().mapToLong(Pair::getRight).sum();
        long ehrFacilityCountSum =
                ehrFacilityCounts.parallelStream().mapToLong(i -> i).sum();
        if (scaledSum > ehrFacilityCountSum) {
            int remainder = (int) ((scaledSum - ehrFacilityCountSum) % scaledEhrDistribution.size());
            int factor = (int) (scaledSum - ehrFacilityCountSum) / scaledEhrDistribution.size();

            for (int i = 0; i < scaledEhrDistribution.size(); i++) {
                Pair<UUID, Integer> toReplace = scaledEhrDistribution.remove(i);
                scaledEhrDistribution.add(
                        i,
                        Pair.of(
                                toReplace.getLeft(),
                                i < remainder ? toReplace.getRight() - factor - 1 : toReplace.getRight() - factor));
            }
        }

        // Link EHRs to be generated to concrete facilities and determine composition count for each EHR (m: 200 sd: 50)
        List<Pair<Integer, List<UUID>>> ehrSettings = new ArrayList<>();
        for (int facilityCount : ehrFacilityCounts) {
            List<UUID> facilities = new ArrayList<>(facilityCount);
            for (int f = 0; f < facilityCount; f++) {
                if (f >= scaledEhrDistribution.size()) {
                    // Fallback for Facility-to-EHR sum < EHR-to-facility sum case
                    facilities.add(facilityNumberToUuid.get(f));
                } else {
                    Pair<UUID, Integer> facilityWithCount = scaledEhrDistribution.remove(f);
                    facilities.add(facilityWithCount.getLeft());
                    if (facilityWithCount.getRight() - 1 > 0) {
                        scaledEhrDistribution.add(
                                0, Pair.of(facilityWithCount.getLeft(), facilityWithCount.getRight() - 1));
                    }
                }
            }
            ehrSettings.add(Pair.of((int) Math.round(Math.ceil(random.nextGaussian() * 50 + 200)), facilities));
        }

        log.info(
                "Start loading test data... ({} EHRs, {} Compositions, {} Healthcare Facilities)",
                properties.getEhr(),
                ehrSettings.stream().mapToLong(Pair::getLeft).sum(),
                properties.getHealthcareFacilities());

        // Actually insert EHRs and Compositions
        IntStream.range(0, properties.getEhr())
                .parallel()
                .mapToObj(ehrSettings::get)
                .forEach(ehrInfo -> {
                    UUID ehrId = insertEhr();
                    insertCompositions(ehrId, ehrInfo.getLeft(), ehrInfo.getRight());
                });

        stopWatch.stop();
        log.info("Test data loaded in {} s", stopWatch.getTotalTimeSeconds());
    }

    private Pair<Integer, UUID> insertHealthcareFacility(int number) {
        var partyRecord = dsl.newRecord(PARTY_IDENTIFIED);
        partyRecord.setPartyRefValue("hcf" + number);
        partyRecord.setPartyRefScheme("id_scheme");
        partyRecord.setPartyRefNamespace("facilities");
        partyRecord.setPartyRefType("ORGANISATION");
        partyRecord.setPartyType(PartyType.party_identified);
        partyRecord.setObjectIdType(PartyRefIdType.generic_id);
        partyRecord.store();
        return Pair.of(number, partyRecord.getId());
    }

    public void insertCompositions(UUID ehrId, int compositionCount, List<UUID> facilities) {
        IntStream.rangeClosed(1, compositionCount).forEach(i -> {
            var composition = getRandomComposition();
            var compositionId = createComposition(ehrId, composition);
            createEntry(compositionId, composition);
            if (composition.getContext() != null) {
                int facilityIndex = i % facilities.size();
                var eventContextId =
                        createEventContext(compositionId, composition.getContext(), facilities.get(facilityIndex));
                createParticipations(eventContextId, composition.getContext().getParticipations());
            }
        });
    }

    public UUID insertEhr() {
        var ehrId = createEhr();
        createStatus(ehrId);
        return ehrId;
    }

    /**
     * Creates an {@link EhrRecord}.
     */
    private UUID createEhr() {
        var ehrRecord = dsl.newRecord(Ehr.EHR_);
        ehrRecord.setDateCreated(Timestamp.valueOf(LocalDateTime.now()));
        ehrRecord.setDateCreatedTzid(zoneId);
        ehrRecord.setSystemId(systemId);
        ehrRecord.store();
        log.trace("Created EHR: {}", ehrRecord.getId());
        return ehrRecord.getId();
    }

    /**
     * Creates an {@link StatusRecord} for the given EHR.
     */
    private void createStatus(UUID ehrId) {
        var partyRecord = dsl.newRecord(PARTY_IDENTIFIED);
        partyRecord.setPartyRefValue(UUID.randomUUID().toString());
        partyRecord.setPartyRefScheme("id_scheme");
        partyRecord.setPartyRefNamespace("patients");
        partyRecord.setPartyRefType("PERSON");
        partyRecord.setPartyType(PartyType.party_self);
        partyRecord.setObjectIdType(PartyRefIdType.generic_id);
        partyRecord.store();

        var statusRecord = dsl.newRecord(STATUS);
        statusRecord.setEhrId(ehrId);
        statusRecord.setParty(partyRecord.getId());
        statusRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
        statusRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(OffsetDateTime.now(), null));
        statusRecord.setHasAudit(createAuditDetails("Create EHR_STATUS"));
        statusRecord.setInContribution(createContribution(ehrId, ContributionDataType.ehr, "Create EHR_STATUS"));
        statusRecord.setArchetypeNodeId("openEHR-EHR-EHR_STATUS.generic.v1");
        statusRecord.setName(new DvCodedTextRecord("EHR Status", null, null, null, null, null));

        statusRecord.store();
        log.trace("Created EHR_STATUS: {}", statusRecord.getId());
    }

    private Composition getRandomComposition() {
        return compositions.get(random.nextInt(compositions.size()));
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

    private UUID createPartyIdentified(PartyProxy composer) {
        var partyIdentifiedRecord = dsl.newRecord(PARTY_IDENTIFIED);

        if (composer instanceof PartyIdentified) {
            partyIdentifiedRecord.setName(((PartyIdentified) composer).getName());
            partyIdentifiedRecord.setPartyType(PartyType.party_identified);
            partyIdentifiedRecord.setObjectIdType(PartyRefIdType.undefined);
            partyIdentifiedRecord.store();
            return partyIdentifiedRecord.getId();
        } else {
            throw new IllegalArgumentException("Unsupported PartyProxy implementation");
        }
    }

    /**
     * Creates a {@link CompositionRecord} for the given EHR.
     */
    private UUID createComposition(UUID ehrId, Composition composition) {
        var compositionRecord = dsl.newRecord(COMPOSITION);
        compositionRecord.setEhrId(ehrId);
        compositionRecord.setInContribution(
                createContribution(ehrId, ContributionDataType.composition, "Create COMPOSITION"));
        compositionRecord.setLanguage(composition.getLanguage().getCodeString());
        compositionRecord.setTerritory(getTerritory(composition.getTerritory().getCodeString()));
        compositionRecord.setComposer(createPartyIdentified(composition.getComposer()));
        compositionRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
        compositionRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(OffsetDateTime.now(), null));
        compositionRecord.setHasAudit(createAuditDetails("Create COMPOSITION"));
        // AttestationRef
        // FeederAudit
        compositionRecord.setLinks(JSONB.jsonb("[]"));
        compositionRecord.store();
        return compositionRecord.getId();
    }

    /**
     * Creates an {@link EntryRecord} for the given composition.
     */
    private void createEntry(UUID compositionId, Composition composition) {
        Assert.notNull(composition.getArchetypeDetails().getTemplateId(), "Template Id must not be null");

        var entryRecord = dsl.newRecord(ENTRY);
        entryRecord.setCompositionId(compositionId);
        entryRecord.setSequence(0);
        entryRecord.setItemType(resolveEntryType(composition));
        entryRecord.setTemplateId(
                composition.getArchetypeDetails().getTemplateId().getValue());
        entryRecord.setArchetypeId(composition.getArchetypeNodeId());
        entryRecord.setCategory(createDvCodedText(composition.getCategory()));
        entryRecord.setEntry(JSONB.jsonb(rawJson.marshal(composition)));
        entryRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
        entryRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(OffsetDateTime.now(), null));
        entryRecord.setRmVersion(composition.getArchetypeDetails().getRmVersion());
        entryRecord.setName(createDvCodedText(composition.getName()));
        entryRecord.store();
    }

    /**
     * Creates an {@link EventContextRecord} for the given composition.
     */
    private UUID createEventContext(UUID compositionId, EventContext eventContext, UUID facilityId) {
        var eventContextRecord = dsl.newRecord(EVENT_CONTEXT);
        eventContextRecord.setCompositionId(compositionId);

        var startTime = eventContext.getStartTime().getValue();
        eventContextRecord.setStartTime(Timestamp.valueOf(LocalDateTime.from(startTime)));
        eventContextRecord.setStartTimeTzid(resolveTimeZone(startTime));
        eventContextRecord.setLocation(eventContext.getLocation());
        eventContextRecord.setSetting(createDvCodedText(eventContext.getSetting()));
        eventContextRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
        eventContextRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(OffsetDateTime.now(), null));
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

        eventContextRecord.store();
        return eventContextRecord.getId();
    }

    /**
     * Creates a {@link ParticipationRecord} for the given event context.
     */
    private void createParticipations(UUID eventContextId, List<Participation> participations) {
        for (var participation : participations) {
            var participationRecord = dsl.newRecord(PARTICIPATION);
            participationRecord.setEventContext(eventContextId);
            participationRecord.setPerformer(createPartyIdentified(participation.getPerformer()));
            participationRecord.setFunction(createDvCodedText(participation.getFunction()));
            participationRecord.setMode(createDvCodedText(participation.getMode()));
            participationRecord.setSysTransaction(Timestamp.valueOf(LocalDateTime.now()));
            participationRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(OffsetDateTime.now(), null));
            if (participation.getTime() != null && participation.getTime().getLower() != null) {
                var lower = participation.getTime().getLower().getValue();
                participationRecord.setTimeLower(Timestamp.valueOf(LocalDateTime.from(lower)));
                participationRecord.setTimeLowerTz(resolveTimeZone(lower));
            }
            if (participation.getTime() != null && participation.getTime().getUpper() != null) {
                var upper = participation.getTime().getUpper().getValue();
                participationRecord.setTimeUpper(Timestamp.valueOf(LocalDateTime.from(upper)));
                participationRecord.setTimeUpperTz(resolveTimeZone(upper));
            }
            participationRecord.store();
        }
    }

    /**
     * Creates a {@link ContributionRecord} of the given EHR.
     */
    private UUID createContribution(UUID ehrId, ContributionDataType contributionType, String auditDetailsDescription) {
        var contributionRecord = dsl.newRecord(CONTRIBUTION);
        contributionRecord.setEhrId(ehrId);
        contributionRecord.setContributionType(contributionType);
        contributionRecord.setState(ContributionState.complete);
        contributionRecord.setHasAudit(createAuditDetails(auditDetailsDescription));
        contributionRecord.store();
        return contributionRecord.getId();
    }

    /**
     * Creates an {@link AuditDetailsRecord} with the given description.
     */
    private UUID createAuditDetails(String description) {
        var auditDetailsRecord = dsl.newRecord(AUDIT_DETAILS);
        auditDetailsRecord.setSystemId(systemId);
        auditDetailsRecord.setCommitter(committerId);
        auditDetailsRecord.setTimeCommitted(Timestamp.valueOf(LocalDateTime.now()));
        auditDetailsRecord.setTimeCommittedTzid(zoneId);
        auditDetailsRecord.setChangeType(ContributionChangeType.creation);
        auditDetailsRecord.setDescription(description);
        auditDetailsRecord.store();
        return auditDetailsRecord.getId();
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
        return dsl.fetchOptional(TERRITORY, TERRITORY.TWOLETTER.eq(code))
                .map(TerritoryRecord::getCode)
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
