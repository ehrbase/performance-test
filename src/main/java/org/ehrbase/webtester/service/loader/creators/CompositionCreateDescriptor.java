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

import java.util.ArrayList;
import java.util.List;
import org.ehrbase.jooq.pg.tables.records.*;
import org.ehrbase.webtester.service.loader.jooq.Entry2Record;

public class CompositionCreateDescriptor {

    private List<Entry2Record> matrixRecords;
    private CompositionRecord composition;
    private AuditDetailsRecord compositionAudit;
    private EntryRecord entry;
    private EventContextRecord eventContext;
    private ContributionRecord contribution;
    private AuditDetailsRecord contributionAudit;
    private List<ParticipationRecord> participations = new ArrayList<>();
    private int versions;

    public List<Entry2Record> getMatrixRecords() {
        return matrixRecords;
    }

    public void setMatrixRecords(List<Entry2Record> matrixRecords) {
        this.matrixRecords = matrixRecords;
    }

    public CompositionRecord getComposition() {
        return composition;
    }

    public void setComposition(CompositionRecord composition) {
        this.composition = composition;
    }

    public AuditDetailsRecord getCompositionAudit() {
        return compositionAudit;
    }

    public void setCompositionAudit(AuditDetailsRecord compositionAudit) {
        this.compositionAudit = compositionAudit;
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

    public ContributionRecord getContribution() {
        return contribution;
    }

    public void setContribution(ContributionRecord contribution) {
        this.contribution = contribution;
    }

    public AuditDetailsRecord getContributionAudit() {
        return contributionAudit;
    }

    public void setContributionAudit(AuditDetailsRecord contributionAudit) {
        this.contributionAudit = contributionAudit;
    }

    public List<ParticipationRecord> getParticipations() {
        return participations;
    }

    public void setParticipations(List<ParticipationRecord> participations) {
        this.participations = participations;
    }

    public int getVersions() {
        return versions;
    }

    public void setVersions(int versions) {
        this.versions = versions;
    }
}
