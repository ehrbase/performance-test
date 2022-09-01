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

import org.ehrbase.jooq.pg.tables.records.*;
import org.ehrbase.webtester.service.loader.jooq.Entry2Record;

import java.util.*;
import java.util.stream.Stream;

public class EhrCreateDescriptor {
    private EhrRecord ehr;
    private StatusRecord status;
    private PartyIdentifiedRecord subject;
    private List<ContributionRecord> contributions = new ArrayList<>();
    private List<AuditDetailsRecord> auditDetails = new ArrayList<>();
    private List<Entry2Record> matrixRecords = new ArrayList<>();
    private List<CompositionRecord> compositions = new ArrayList<>();
    private List<EntryRecord> entries = new ArrayList<>();
    private List<EventContextRecord> eventContexts = new ArrayList<>();
    private List<ParticipationRecord> participations = new ArrayList<>();
    private Map<UUID, Integer> compositionIdToVersionCount = new HashMap<>();
    private Map<UUID, Integer> eventCtxIdToVersionCount = new HashMap<>();

    public EhrRecord getEhr() {
        return ehr;
    }

    public void setEhr(EhrRecord ehr) {
        this.ehr = ehr;
    }

    public StatusRecord getStatus() {
        return status;
    }

    public void setStatus(StatusRecord status) {
        this.status = status;
    }

    public PartyIdentifiedRecord getSubject() {
        return subject;
    }

    public void setSubject(PartyIdentifiedRecord subject) {
        this.subject = subject;
    }

    public List<ContributionRecord> getContributions() {
        return contributions;
    }

    public void setContributions(List<ContributionRecord> contributions) {
        this.contributions = contributions;
    }

    public List<AuditDetailsRecord> getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(List<AuditDetailsRecord> auditDetails) {
        this.auditDetails = auditDetails;
    }

    public List<Entry2Record> getMatrixRecords() {
        return matrixRecords;
    }

    public void setMatrixRecords(List<Entry2Record> matrixRecords) {
        this.matrixRecords = matrixRecords;
    }

    public List<CompositionRecord> getCompositions() {
        return compositions;
    }

    public void setCompositions(List<CompositionRecord> compositions) {
        this.compositions = compositions;
    }

    public List<EntryRecord> getEntries() {
        return entries;
    }

    public void setEntries(List<EntryRecord> entries) {
        this.entries = entries;
    }

    public List<EventContextRecord> getEventContexts() {
        return eventContexts;
    }

    public void setEventContexts(List<EventContextRecord> eventContexts) {
        this.eventContexts = eventContexts;
    }

    public List<ParticipationRecord> getParticipations() {
        return participations;
    }

    public void setParticipations(List<ParticipationRecord> participations) {
        this.participations = participations;
    }

    public Map<UUID, Integer> getCompositionIdToVersionCount() {
        return compositionIdToVersionCount;
    }

    public void setCompositionIdToVersionCount(Map<UUID, Integer> compositionIdToVersionCount) {
        this.compositionIdToVersionCount = compositionIdToVersionCount;
    }

    public Map<UUID, Integer> getEventCtxIdToVersionCount() {
        return eventCtxIdToVersionCount;
    }

    public void setEventCtxIdToVersionCount(Map<UUID, Integer> eventCtxIdToVersionCount) {
        this.eventCtxIdToVersionCount = eventCtxIdToVersionCount;
    }

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
