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

import static org.ehrbase.jooq.pg.tables.Status.STATUS;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.ehrbase.jooq.pg.enums.ContributionDataType;
import org.ehrbase.jooq.pg.enums.PartyType;
import org.ehrbase.jooq.pg.tables.Ehr;
import org.ehrbase.jooq.pg.tables.records.AuditDetailsRecord;
import org.ehrbase.jooq.pg.tables.records.ContributionRecord;
import org.ehrbase.jooq.pg.tables.records.EhrRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.jooq.pg.tables.records.StatusRecord;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.ehrbase.webtester.service.loader.CachedComposition;
import org.ehrbase.webtester.service.loader.RandomHelper;
import org.jooq.DSLContext;

public class EhrCreator extends AbstractDataCreator<EhrCreateDescriptor, EhrCreator.EhrCreationInfo> {

    public static class EhrCreationInfo {
        private final List<Pair<UUID, String>> facilities;
        private final int compositionCount;
        private final Map<UUID, List<Pair<UUID, String>>> facilityIdToHcpId;
        private final Set<CompositionCreationInfo.CompositionDataMode> modes;

        public EhrCreationInfo(
                List<Pair<UUID, String>> facilities,
                int compositionCount,
                Map<UUID, List<Pair<UUID, String>>> facilityIdToHcpId,
                Set<CompositionCreationInfo.CompositionDataMode> modes) {
            this.facilities = facilities;
            this.compositionCount = compositionCount;
            this.facilityIdToHcpId = facilityIdToHcpId;
            this.modes = modes;
        }

        public List<Pair<UUID, String>> getFacilities() {
            return facilities;
        }

        public int getCompositionCount() {
            return compositionCount;
        }

        public Map<UUID, List<Pair<UUID, String>>> getFacilityIdToHcpId() {
            return facilityIdToHcpId;
        }

        public Set<CompositionCreationInfo.CompositionDataMode> getModes() {
            return modes;
        }
    }

    private final CompositionCreator compositionCreator;
    private final List<CachedComposition> singleCompositions;
    private final List<List<CachedComposition>> repeatableCompositions;

    public EhrCreator(
            DSLContext dsl,
            String zoneId,
            UUID systemId,
            UUID committerId,
            Map<String, Integer> territories,
            List<CachedComposition> singleCompositions,
            List<List<CachedComposition>> repeatableCompositions) {
        super(dsl, zoneId, systemId, committerId, territories);
        this.singleCompositions = singleCompositions;
        this.repeatableCompositions = repeatableCompositions;
        compositionCreator = new CompositionCreator(dsl, zoneId, systemId, committerId, territories);
    }

    @Override
    public EhrCreateDescriptor create(EhrCreationInfo info) {
        EhrCreateDescriptor ehrDescriptor = new EhrCreateDescriptor();
        UUID ehrId = UUID.randomUUID();
        OffsetDateTime sysTransaction = OffsetDateTime.now();

        // EHR and status
        AuditDetailsRecord contributionAuditDetails = createAuditDetails("Create EHR_STATUS", sysTransaction);
        ContributionRecord statusContribution =
                createContribution(ehrId, contributionAuditDetails.getId(), ContributionDataType.ehr);
        Triple<StatusRecord, PartyIdentifiedRecord, AuditDetailsRecord> status =
                createStatus(ehrId, statusContribution.getId(), sysTransaction);

        ehrDescriptor.setEhr(createEhr(ehrId, sysTransaction));
        ehrDescriptor.setStatus(status.getLeft());
        ehrDescriptor.setSubject(status.getMiddle());
        ehrDescriptor.getContributions().add(statusContribution);
        ehrDescriptor.getAuditDetails().add(status.getRight());
        ehrDescriptor.getAuditDetails().add(contributionAuditDetails);

        // Compositions
        List<CompositionCreateDescriptor> compositionDescriptors = IntStream.range(0, info.getCompositionCount())
                .parallel()
                .mapToObj(i -> compositionCreator.create(new CompositionCreationInfo(
                        ehrId,
                        info.getFacilities().get(i % info.getFacilities().size()),
                        info.getFacilityIdToHcpId()
                                .get(info.getFacilities()
                                        .get(i % info.getFacilities().size())
                                        .getKey()),
                        selectComposition(i),
                        info.modes,
                        i)))
                .collect(Collectors.toList());
        ehrDescriptor.setCompositions(compositionDescriptors.stream()
                .map(CompositionCreateDescriptor::getComposition)
                .collect(Collectors.toList()));
        ehrDescriptor.setParticipations(compositionDescriptors.stream()
                .flatMap(d -> d.getParticipations().stream())
                .collect(Collectors.toList()));
        ehrDescriptor
                .getAuditDetails()
                .addAll(compositionDescriptors.stream()
                        .flatMap(d -> Stream.of(d.getCompositionAudit(), d.getContributionAudit()))
                        .collect(Collectors.toList()));
        ehrDescriptor.setEventContexts(compositionDescriptors.stream()
                .map(CompositionCreateDescriptor::getEventContext)
                .collect(Collectors.toList()));
        ehrDescriptor.setEntries(compositionDescriptors.stream()
                .map(CompositionCreateDescriptor::getEntry)
                .collect(Collectors.toList()));
        ehrDescriptor
                .getContributions()
                .addAll(compositionDescriptors.stream()
                        .map(CompositionCreateDescriptor::getContribution)
                        .collect(Collectors.toList()));

        ehrDescriptor.setCompositionIdToVersionCount(compositionDescriptors.stream()
                .filter(c -> c.getVersions() > 1)
                .collect(Collectors.toMap(c -> c.getComposition().getId(), CompositionCreateDescriptor::getVersions)));
        ehrDescriptor.setEventCtxIdToVersionCount(compositionDescriptors.stream()
                .filter(c -> c.getVersions() > 1)
                .collect(Collectors.toMap(c -> c.getEventContext().getId(), CompositionCreateDescriptor::getVersions)));

        return ehrDescriptor;
    }

    private CachedComposition selectComposition(int compositionNumber) {
        if (compositionNumber < singleCompositions.size()) {
            return singleCompositions.get(compositionNumber);
        } else {
            List<CachedComposition> compositionData = this.repeatableCompositions.get(
                    (compositionNumber - singleCompositions.size()) % repeatableCompositions.size());
            return compositionData.size() > 1
                    ? compositionData.get(RandomHelper.RND.get().nextInt(compositionData.size()))
                    : compositionData.get(0);
        }
    }

    /**
     * Creates an {@link EhrRecord}.
     */
    private EhrRecord createEhr(UUID ehrId, OffsetDateTime sysTransaction) {
        EhrRecord ehrRecord = getDsl().newRecord(Ehr.EHR_);
        ehrRecord.setDateCreated(Timestamp.valueOf(sysTransaction.toLocalDateTime()));
        ehrRecord.setDateCreatedTzid(getZoneId());
        ehrRecord.setSystemId(getSystemId());
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
        StatusRecord statusRecord = getDsl().newRecord(STATUS);
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
}
