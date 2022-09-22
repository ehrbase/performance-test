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
package org.ehrbase.webtester.service.loader.creators;

import static org.ehrbase.jooq.pg.tables.Composition.COMPOSITION;
import static org.ehrbase.jooq.pg.tables.Entry.ENTRY;
import static org.ehrbase.jooq.pg.tables.EventContext.EVENT_CONTEXT;
import static org.ehrbase.jooq.pg.tables.Participation.PARTICIPATION;

import com.nedap.archie.rm.composition.Composition;
import com.nedap.archie.rm.composition.EventContext;
import com.nedap.archie.rm.datatypes.CodePhrase;
import com.nedap.archie.rm.datavalues.DvCodedText;
import com.nedap.archie.rm.datavalues.DvText;
import com.nedap.archie.rm.support.identification.TerminologyId;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.collections4.CollectionUtils;
import org.ehrbase.jooq.pg.tables.records.CompositionRecord;
import org.ehrbase.jooq.pg.tables.records.EntryRecord;
import org.ehrbase.jooq.pg.tables.records.EventContextRecord;
import org.ehrbase.jooq.pg.tables.records.ParticipationRecord;
import org.ehrbase.webtester.service.loader.CachedComposition;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.springframework.util.Assert;

/**
 * Creates composition data specific to the legacy/old data model
 */
public class LegacyCompositionCreator
        extends AbstractDataCreator<
                LegacyCompositionCreator.LegacyCompositionData,
                LegacyCompositionCreator.LegacyCompositionCreationInfo> {

    public static class LegacyCompositionData {
        private CompositionRecord composition;
        private EntryRecord entry;
        private EventContextRecord eventContext;
        private List<ParticipationRecord> participations = new ArrayList<>();

        public CompositionRecord getComposition() {
            return composition;
        }

        public void setComposition(CompositionRecord composition) {
            this.composition = composition;
        }

        public EntryRecord getEntry() {
            return entry;
        }

        public void setEntry(EntryRecord entry) {
            this.entry = entry;
        }

        public EventContextRecord getEventContext() {
            return eventContext;
        }

        public void setEventContext(EventContextRecord eventContext) {
            this.eventContext = eventContext;
        }

        public List<ParticipationRecord> getParticipations() {
            return participations;
        }

        public void setParticipations(List<ParticipationRecord> participations) {
            this.participations = participations;
        }
    }

    public static class LegacyCompositionCreationInfo {
        private final UUID composerId;
        private final UUID compositionId;
        private final UUID contributionId;
        private final UUID auditDetailsId;
        private final UUID ehrId;
        private final UUID facility;
        private final List<UUID> participants;
        private final CachedComposition selectedComposition;
        private final OffsetDateTime sysTransaction;

        public LegacyCompositionCreationInfo(
                UUID ehrId,
                UUID composerId,
                UUID compositionId,
                UUID contributionId,
                UUID auditDetailsId,
                UUID facility,
                List<UUID> participants,
                CachedComposition selectedComposition,
                OffsetDateTime sysTransaction) {
            this.composerId = composerId;
            this.compositionId = compositionId;
            this.contributionId = contributionId;
            this.auditDetailsId = auditDetailsId;
            this.ehrId = ehrId;
            this.facility = facility;
            this.participants = participants;
            this.selectedComposition = selectedComposition;
            this.sysTransaction = sysTransaction;
        }

        public UUID getContributionId() {
            return contributionId;
        }

        public UUID getAuditDetailsId() {
            return auditDetailsId;
        }

        public UUID getCompositionId() {
            return compositionId;
        }

        public UUID getComposerId() {
            return composerId;
        }

        public UUID getEhrId() {
            return ehrId;
        }

        public UUID getFacility() {
            return facility;
        }

        public List<UUID> getParticipants() {
            return participants;
        }

        public CachedComposition getSelectedComposition() {
            return selectedComposition;
        }

        public OffsetDateTime getSysTransaction() {
            return sysTransaction;
        }
    }

    protected LegacyCompositionCreator(
            DSLContext dsl, String zoneId, UUID systemId, UUID committerId, Map<String, Integer> territories) {
        super(dsl, zoneId, systemId, committerId, territories);
    }

    public LegacyCompositionData create(LegacyCompositionCreationInfo info) {
        LegacyCompositionData createDescriptor = new LegacyCompositionData();
        createDescriptor.setComposition(createComposition(info));
        createDescriptor.setEntry(createEntry(
                createDescriptor.getComposition().getId(),
                info.getSelectedComposition().getComposition(),
                info.getSysTransaction(),
                info.getSelectedComposition().getIdx()));
        createDescriptor.setEventContext(createEventContext(
                createDescriptor.getComposition().getId(),
                info.getSelectedComposition().getComposition().getContext(),
                info.getFacility(),
                info.getSysTransaction()));

        if (CollectionUtils.isNotEmpty(info.getParticipants())) {
            info.getParticipants().stream()
                    .map(p -> createHcpParticipation(createDescriptor.getEventContext(), p, info.getSysTransaction()))
                    .forEach(createDescriptor.getParticipations()::add);
        }

        return createDescriptor;
    }

    private CompositionRecord createComposition(LegacyCompositionCreationInfo info) {

        CompositionRecord compositionRecord = getDsl().newRecord(COMPOSITION);
        compositionRecord.setEhrId(info.getEhrId());
        compositionRecord.setInContribution(info.getContributionId());
        compositionRecord.setLanguage(
                info.getSelectedComposition().getComposition().getLanguage().getCodeString());
        compositionRecord.setTerritory(getTerritory(
                info.getSelectedComposition().getComposition().getTerritory().getCodeString()));
        compositionRecord.setComposer(info.getComposerId());
        compositionRecord.setSysTransaction(
                Timestamp.valueOf(info.getSysTransaction().toLocalDateTime()));
        compositionRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(info.getSysTransaction(), null));
        compositionRecord.setHasAudit(info.getAuditDetailsId());
        // AttestationRef
        // FeederAudit
        compositionRecord.setLinks(JSONB.jsonb("[]"));
        compositionRecord.setId(info.getCompositionId());
        return compositionRecord;
    }

    /**
     * Creates an {@link EntryRecord} for the given composition.
     */
    private EntryRecord createEntry(
            UUID compositionId, Composition composition, OffsetDateTime sysTransaction, int compositionIndex) {
        Assert.notNull(composition.getArchetypeDetails().getTemplateId(), "Template Id must not be null");

        EntryRecord entryRecord = getDsl().newRecord(ENTRY);
        entryRecord.setCompositionId(compositionId);
        entryRecord.setSequence(compositionIndex);
        entryRecord.setItemType(resolveEntryType(composition));
        entryRecord.setTemplateId(
                composition.getArchetypeDetails().getTemplateId().getValue());
        entryRecord.setArchetypeId(composition.getArchetypeNodeId());
        entryRecord.setCategory(DataCreator.createDvCodedText(composition.getCategory()));
        entryRecord.setSysTransaction(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        entryRecord.setSysPeriod(new AbstractMap.SimpleEntry<>(sysTransaction, null));
        entryRecord.setRmVersion(composition.getArchetypeDetails().getRmVersion());
        entryRecord.setName(DataCreator.createDvCodedText(composition.getName()));
        entryRecord.setId(UUID.randomUUID());

        return entryRecord;
    }

    /**
     * Creates an {@link EventContextRecord} for the given composition.
     */
    private EventContextRecord createEventContext(
            UUID compositionId, EventContext eventContext, UUID facilityId, OffsetDateTime sysTransaction) {
        var eventContextRecord = getDsl().newRecord(EVENT_CONTEXT);
        eventContextRecord.setCompositionId(compositionId);

        var startTime = eventContext.getStartTime().getValue();
        eventContextRecord.setStartTime(Timestamp.valueOf(LocalDateTime.from(startTime)));
        eventContextRecord.setStartTimeTzid(resolveTimeZone(startTime));
        eventContextRecord.setLocation(eventContext.getLocation());
        eventContextRecord.setSetting(DataCreator.createDvCodedText(eventContext.getSetting()));
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
            eventContextRecord.setOtherContext(asJsonb(eventContext.getOtherContext()));
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
        ParticipationRecord participationRecord = getDsl().newRecord(PARTICIPATION);
        participationRecord.setEventContext(eventCtx.getId());
        participationRecord.setPerformer(hcpId);
        participationRecord.setFunction(DataCreator.createDvCodedText(new DvText("function")));
        participationRecord.setMode(DataCreator.createDvCodedText(
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
}
