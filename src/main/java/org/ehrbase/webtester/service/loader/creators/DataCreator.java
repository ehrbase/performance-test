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

import com.nedap.archie.rm.datatypes.CodePhrase;
import com.nedap.archie.rm.datavalues.DvCodedText;
import com.nedap.archie.rm.datavalues.DvText;
import com.nedap.archie.rm.datavalues.TermMapping;
import com.nedap.archie.rm.support.identification.TerminologyId;
import org.apache.commons.collections4.CollectionUtils;
import org.ehrbase.jooq.pg.enums.*;
import org.ehrbase.jooq.pg.tables.records.AuditDetailsRecord;
import org.ehrbase.jooq.pg.tables.records.ContributionRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.jooq.pg.udt.records.CodePhraseRecord;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.jooq.DSLContext;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.ehrbase.jooq.pg.Tables.PARTY_IDENTIFIED;
import static org.ehrbase.jooq.pg.tables.AuditDetails.AUDIT_DETAILS;
import static org.ehrbase.jooq.pg.tables.Contribution.CONTRIBUTION;

public interface DataCreator<DESCRIPTOR, PARAM_OBJ> {

    DESCRIPTOR create(PARAM_OBJ info);

    /**
     * Creates a {@link ContributionRecord} of the given EHR.
     */
    static ContributionRecord createContribution(
            DSLContext dsl, UUID ehrId, UUID auditDetailsId, ContributionDataType contributionType) {

        ContributionRecord contributionRecord = dsl.newRecord(CONTRIBUTION);
        contributionRecord.setEhrId(ehrId);
        contributionRecord.setContributionType(contributionType);
        contributionRecord.setState(ContributionState.complete);
        contributionRecord.setHasAudit(auditDetailsId);
        contributionRecord.setId(UUID.randomUUID());

        return contributionRecord;
    }

    /**
     * Creates an {@link AuditDetailsRecord} with the given description.
     */
    static AuditDetailsRecord createAuditDetails(
            DSLContext dsl,
            UUID systemId,
            UUID committerId,
            String zoneId,
            String description,
            OffsetDateTime sysTransaction) {
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

    static DvCodedTextRecord createDvCodedText(DvText dvText) {
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

    static CodePhraseRecord createCodePhrase(CodePhrase codePhrase) {
        if (codePhrase == null) {
            return null;
        }
        return new CodePhraseRecord(codePhrase.getTerminologyId().getValue(), codePhrase.getCodeString());
    }

    static String[] createTermMappings(List<TermMapping> termMappings) {
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

    static PartyIdentifiedRecord createPartyWithRef(
            DSLContext dsl, String name, String namespace, String type, PartyType partyType) {
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
}
