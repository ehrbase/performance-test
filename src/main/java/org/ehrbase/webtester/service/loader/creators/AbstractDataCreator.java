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

import static org.ehrbase.jooq.pg.Tables.SYSTEM;

import com.nedap.archie.rm.RMObject;
import com.nedap.archie.rm.composition.AdminEntry;
import com.nedap.archie.rm.composition.CareEntry;
import com.nedap.archie.rm.composition.Composition;
import com.nedap.archie.rm.composition.Section;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAccessor;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.ehrbase.jooq.pg.enums.ContributionDataType;
import org.ehrbase.jooq.pg.enums.EntryType;
import org.ehrbase.jooq.pg.enums.PartyType;
import org.ehrbase.jooq.pg.tables.records.AuditDetailsRecord;
import org.ehrbase.jooq.pg.tables.records.ContributionRecord;
import org.ehrbase.jooq.pg.tables.records.PartyIdentifiedRecord;
import org.ehrbase.jooq.pg.tables.records.SystemRecord;
import org.ehrbase.serialisation.dbencoding.RawJson;
import org.jooq.DSLContext;
import org.jooq.JSONB;

public abstract class AbstractDataCreator<DESCRIPTOR, PARAM_OBJ> implements DataCreator<DESCRIPTOR, PARAM_OBJ> {

    private final DSLContext dsl;
    private final String zoneId;
    private final UUID systemId;
    private final String systemSetting;
    private final UUID committerId;
    private final Map<String, Integer> territories;
    private final RawJson rawJson = new RawJson();
    private final Random random = new SecureRandom();

    protected AbstractDataCreator(
            DSLContext dsl, String zoneId, UUID systemId, UUID committerId, Map<String, Integer> territories) {
        this.dsl = dsl;
        this.zoneId = zoneId;
        this.systemId = systemId;
        this.committerId = committerId;
        this.territories = MapUtils.unmodifiableMap(territories);
        this.systemSetting = dsl.fetchOptional(SYSTEM, SYSTEM.ID.eq(getSystemId()))
                .map(SystemRecord::getSettings)
                .orElseThrow();
    }

    public DSLContext getDsl() {
        return dsl;
    }

    public String getZoneId() {
        return zoneId;
    }

    public UUID getSystemId() {
        return systemId;
    }

    public String getSystemSetting() {
        return systemSetting;
    }

    public UUID getCommitterId() {
        return committerId;
    }

    protected JSONB asJsonb(RMObject rmObj) {
        return JSONB.jsonb(rawJson.marshal(rmObj));
    }

    /**
     * Creates a {@link ContributionRecord} of the given EHR.
     */
    protected ContributionRecord createContribution(
            UUID ehrId, UUID auditDetailsId, ContributionDataType contributionType) {
        return DataCreator.createContribution(dsl, ehrId, auditDetailsId, contributionType);
    }

    /**
     * Creates an {@link AuditDetailsRecord} with the given description.
     */
    protected AuditDetailsRecord createAuditDetails(String description, OffsetDateTime sysTransaction) {
        return DataCreator.createAuditDetails(dsl, systemId, committerId, zoneId, description, sysTransaction);
    }

    protected PartyIdentifiedRecord createPartyWithRef(
            String name, String namespace, String type, PartyType partyType) {
        return DataCreator.createPartyWithRef(dsl, name, namespace, type, partyType);
    }

    protected EntryType resolveEntryType(Composition composition) {
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

    protected String resolveTimeZone(TemporalAccessor temporal) {
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

    protected Integer getTerritory(String code) {
        return Optional.ofNullable(territories.get(code))
                .orElseThrow(() -> new IllegalArgumentException("Territory " + code + " not found"));
    }

    public Random getRandom() {
        return random;
    }
}
