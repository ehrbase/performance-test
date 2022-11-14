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
package org.ehrbase.jooq.pg;

import java.util.UUID;
import org.ehrbase.jooq.pg.tables.Access;
import org.ehrbase.jooq.pg.tables.AdminDeleteAudit;
import org.ehrbase.jooq.pg.tables.AdminDeleteComposition;
import org.ehrbase.jooq.pg.tables.AdminDeleteCompositionHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteContribution;
import org.ehrbase.jooq.pg.tables.AdminDeleteEhrFull;
import org.ehrbase.jooq.pg.tables.AdminDeleteEventContextForCompo;
import org.ehrbase.jooq.pg.tables.AdminDeleteFolder;
import org.ehrbase.jooq.pg.tables.AdminDeleteFolderHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteStatusHistory;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedCompositionsForContrib;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedStatusForContrib;
import org.ehrbase.jooq.pg.tables.AdminGetTemplateUsage;
import org.ehrbase.jooq.pg.tables.Attestation;
import org.ehrbase.jooq.pg.tables.AttestedView;
import org.ehrbase.jooq.pg.tables.CompoXref;
import org.ehrbase.jooq.pg.tables.Composition;
import org.ehrbase.jooq.pg.tables.CompositionHistory;
import org.ehrbase.jooq.pg.tables.Concept;
import org.ehrbase.jooq.pg.tables.Contribution;
import org.ehrbase.jooq.pg.tables.Ehr;
import org.ehrbase.jooq.pg.tables.Entry;
import org.ehrbase.jooq.pg.tables.EntryHistory;
import org.ehrbase.jooq.pg.tables.EventContext;
import org.ehrbase.jooq.pg.tables.EventContextHistory;
import org.ehrbase.jooq.pg.tables.Folder;
import org.ehrbase.jooq.pg.tables.FolderHierarchy;
import org.ehrbase.jooq.pg.tables.FolderHierarchyHistory;
import org.ehrbase.jooq.pg.tables.FolderHistory;
import org.ehrbase.jooq.pg.tables.FolderItems;
import org.ehrbase.jooq.pg.tables.FolderItemsHistory;
import org.ehrbase.jooq.pg.tables.ObjectRef;
import org.ehrbase.jooq.pg.tables.ParticipationHistory;
import org.ehrbase.jooq.pg.tables.PartyIdentified;
import org.ehrbase.jooq.pg.tables.PartyUsageIdentification;
import org.ehrbase.jooq.pg.tables.Plugin;
import org.ehrbase.jooq.pg.tables.Status;
import org.ehrbase.jooq.pg.tables.StatusHistory;
import org.ehrbase.jooq.pg.tables.System;
import org.ehrbase.jooq.pg.tables.TemplateStore;
import org.ehrbase.jooq.pg.tables.Territory;
import org.ehrbase.jooq.pg.tables.XjsonbArrayElements;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteAttestationRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteCompositionHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteCompositionRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteContributionRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrFullRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedCompositionsForContribRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedCompositionsRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedStatusForContribRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetTemplateUsageRecord;
import org.ehrbase.jooq.pg.tables.records.JsonbArrayElementsRecord;
import org.ehrbase.jooq.pg.tables.records.PartyUsageIdentificationRecord;
import org.ehrbase.jooq.pg.tables.records.XjsonbArrayElementsRecord;
import org.ehrbase.jooq.pg.tables.AdminDeleteAttestation;
import org.ehrbase.jooq.pg.tables.AdminDeleteEhr;
import org.ehrbase.jooq.pg.tables.AdminDeleteEhrHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteFolderObjRefHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteStatus;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedCompositions;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedContributions;
import org.ehrbase.jooq.pg.tables.AttestationRef;
import org.ehrbase.jooq.pg.tables.AuditDetails;
import org.ehrbase.jooq.pg.tables.FlywaySchemaHistory;
import org.ehrbase.jooq.pg.tables.Heading;
import org.ehrbase.jooq.pg.tables.Identifier;
import org.ehrbase.jooq.pg.tables.JsonbArrayElements;
import org.ehrbase.jooq.pg.tables.Language;
import org.ehrbase.jooq.pg.tables.ObjectRefHistory;
import org.ehrbase.jooq.pg.tables.Participation;
import org.ehrbase.jooq.pg.tables.SessionLog;
import org.ehrbase.jooq.pg.tables.StoredQuery;
import org.ehrbase.jooq.pg.tables.TerminologyProvider;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteAuditRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEventContextForCompoRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderObjRefHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteStatusHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteStatusRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedContributionsRecord;
import org.jooq.Configuration;
import org.jooq.Field;
import org.jooq.JSONB;
import org.jooq.Result;

/**
 * Convenience access to all tables in ehr.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class Tables {

    /**
     * defines the modality for accessing an com.ethercis.ehr (security strategy
     * implementation)
     */
    public static final Access ACCESS = Access.ACCESS;

    /**
     * The table <code>ehr.admin_delete_attestation</code>.
     */
    public static final AdminDeleteAttestation ADMIN_DELETE_ATTESTATION =
            AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION;

    /**
     * Call <code>ehr.admin_delete_attestation</code>.
     */
    public static Result<AdminDeleteAttestationRecord> ADMIN_DELETE_ATTESTATION(
            Configuration configuration, UUID attestRefInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION.call(attestRefInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_attestation</code> as a table.
     */
    public static AdminDeleteAttestation ADMIN_DELETE_ATTESTATION(UUID attestRefInput) {
        return AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION.call(attestRefInput);
    }

    /**
     * Get <code>ehr.admin_delete_attestation</code> as a table.
     */
    public static AdminDeleteAttestation ADMIN_DELETE_ATTESTATION(Field<UUID> attestRefInput) {
        return AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION.call(attestRefInput);
    }

    /**
     * The table <code>ehr.admin_delete_audit</code>.
     */
    public static final AdminDeleteAudit ADMIN_DELETE_AUDIT = AdminDeleteAudit.ADMIN_DELETE_AUDIT;

    /**
     * Call <code>ehr.admin_delete_audit</code>.
     */
    public static Result<AdminDeleteAuditRecord> ADMIN_DELETE_AUDIT(Configuration configuration, UUID auditInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_audit</code> as a table.
     */
    public static AdminDeleteAudit ADMIN_DELETE_AUDIT(UUID auditInput) {
        return AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput);
    }

    /**
     * Get <code>ehr.admin_delete_audit</code> as a table.
     */
    public static AdminDeleteAudit ADMIN_DELETE_AUDIT(Field<UUID> auditInput) {
        return AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput);
    }

    /**
     * The table <code>ehr.admin_delete_composition</code>.
     */
    public static final AdminDeleteComposition ADMIN_DELETE_COMPOSITION =
            AdminDeleteComposition.ADMIN_DELETE_COMPOSITION;

    /**
     * Call <code>ehr.admin_delete_composition</code>.
     */
    public static Result<AdminDeleteCompositionRecord> ADMIN_DELETE_COMPOSITION(
            Configuration configuration, UUID compoIdInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.call(compoIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_composition</code> as a table.
     */
    public static AdminDeleteComposition ADMIN_DELETE_COMPOSITION(UUID compoIdInput) {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.call(compoIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_composition</code> as a table.
     */
    public static AdminDeleteComposition ADMIN_DELETE_COMPOSITION(Field<UUID> compoIdInput) {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.call(compoIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_composition_history</code>.
     */
    public static final AdminDeleteCompositionHistory ADMIN_DELETE_COMPOSITION_HISTORY =
            AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY;

    /**
     * Call <code>ehr.admin_delete_composition_history</code>.
     */
    public static Result<AdminDeleteCompositionHistoryRecord> ADMIN_DELETE_COMPOSITION_HISTORY(
            Configuration configuration, UUID compoInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY.call(
                                compoInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_composition_history</code> as a table.
     */
    public static AdminDeleteCompositionHistory ADMIN_DELETE_COMPOSITION_HISTORY(UUID compoInput) {
        return AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY.call(
                compoInput);
    }

    /**
     * Get <code>ehr.admin_delete_composition_history</code> as a table.
     */
    public static AdminDeleteCompositionHistory ADMIN_DELETE_COMPOSITION_HISTORY(Field<UUID> compoInput) {
        return AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY.call(
                compoInput);
    }

    /**
     * The table <code>ehr.admin_delete_contribution</code>.
     */
    public static final AdminDeleteContribution ADMIN_DELETE_CONTRIBUTION =
            AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION;

    /**
     * Call <code>ehr.admin_delete_contribution</code>.
     */
    public static Result<AdminDeleteContributionRecord> ADMIN_DELETE_CONTRIBUTION(
            Configuration configuration, UUID contribIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION.call(
                        contribIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_contribution</code> as a table.
     */
    public static AdminDeleteContribution ADMIN_DELETE_CONTRIBUTION(UUID contribIdInput) {
        return AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION.call(contribIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_contribution</code> as a table.
     */
    public static AdminDeleteContribution ADMIN_DELETE_CONTRIBUTION(Field<UUID> contribIdInput) {
        return AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION.call(contribIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_ehr</code>.
     */
    public static final AdminDeleteEhr ADMIN_DELETE_EHR = AdminDeleteEhr.ADMIN_DELETE_EHR;

    /**
     * Call <code>ehr.admin_delete_ehr</code>.
     */
    public static Result<AdminDeleteEhrRecord> ADMIN_DELETE_EHR(Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr</code> as a table.
     */
    public static AdminDeleteEhr ADMIN_DELETE_EHR(UUID ehrIdInput) {
        return AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_ehr</code> as a table.
     */
    public static AdminDeleteEhr ADMIN_DELETE_EHR(Field<UUID> ehrIdInput) {
        return AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_ehr_full</code>.
     */
    public static final AdminDeleteEhrFull ADMIN_DELETE_EHR_FULL = AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL;

    /**
     * Call <code>ehr.admin_delete_ehr_full</code>.
     */
    public static Result<AdminDeleteEhrFullRecord> ADMIN_DELETE_EHR_FULL(Configuration configuration, UUID ehrIdParam) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr_full</code> as a table.
     */
    public static AdminDeleteEhrFull ADMIN_DELETE_EHR_FULL(UUID ehrIdParam) {
        return AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam);
    }

    /**
     * Get <code>ehr.admin_delete_ehr_full</code> as a table.
     */
    public static AdminDeleteEhrFull ADMIN_DELETE_EHR_FULL(Field<UUID> ehrIdParam) {
        return AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam);
    }

    /**
     * The table <code>ehr.admin_delete_ehr_history</code>.
     */
    public static final AdminDeleteEhrHistory ADMIN_DELETE_EHR_HISTORY = AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY;

    /**
     * Call <code>ehr.admin_delete_ehr_history</code>.
     */
    public static Result<AdminDeleteEhrHistoryRecord> ADMIN_DELETE_EHR_HISTORY(
            Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr_history</code> as a table.
     */
    public static AdminDeleteEhrHistory ADMIN_DELETE_EHR_HISTORY(UUID ehrIdInput) {
        return AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_ehr_history</code> as a table.
     */
    public static AdminDeleteEhrHistory ADMIN_DELETE_EHR_HISTORY(Field<UUID> ehrIdInput) {
        return AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_event_context_for_compo</code>.
     */
    public static final AdminDeleteEventContextForCompo ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO =
            AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO;

    /**
     * Call <code>ehr.admin_delete_event_context_for_compo</code>.
     */
    public static Result<AdminDeleteEventContextForCompoRecord> ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO(
            Configuration configuration, UUID compoIdInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO
                                .call(compoIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_event_context_for_compo</code> as a table.
     */
    public static AdminDeleteEventContextForCompo ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO(UUID compoIdInput) {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.call(
                compoIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_event_context_for_compo</code> as a table.
     */
    public static AdminDeleteEventContextForCompo ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO(Field<UUID> compoIdInput) {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.call(
                compoIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_folder</code>.
     */
    public static final AdminDeleteFolder ADMIN_DELETE_FOLDER = AdminDeleteFolder.ADMIN_DELETE_FOLDER;

    /**
     * Call <code>ehr.admin_delete_folder</code>.
     */
    public static Result<AdminDeleteFolderRecord> ADMIN_DELETE_FOLDER(Configuration configuration, UUID folderIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_folder</code> as a table.
     */
    public static AdminDeleteFolder ADMIN_DELETE_FOLDER(UUID folderIdInput) {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder</code> as a table.
     */
    public static AdminDeleteFolder ADMIN_DELETE_FOLDER(Field<UUID> folderIdInput) {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_folder_history</code>.
     */
    public static final AdminDeleteFolderHistory ADMIN_DELETE_FOLDER_HISTORY =
            AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY;

    /**
     * Call <code>ehr.admin_delete_folder_history</code>.
     */
    public static Result<AdminDeleteFolderHistoryRecord> ADMIN_DELETE_FOLDER_HISTORY(
            Configuration configuration, UUID folderIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY.call(
                        folderIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_folder_history</code> as a table.
     */
    public static AdminDeleteFolderHistory ADMIN_DELETE_FOLDER_HISTORY(UUID folderIdInput) {
        return AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY.call(folderIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder_history</code> as a table.
     */
    public static AdminDeleteFolderHistory ADMIN_DELETE_FOLDER_HISTORY(Field<UUID> folderIdInput) {
        return AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY.call(folderIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_folder_obj_ref_history</code>.
     */
    public static final AdminDeleteFolderObjRefHistory ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY =
            AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY;

    /**
     * Call <code>ehr.admin_delete_folder_obj_ref_history</code>.
     */
    public static Result<AdminDeleteFolderObjRefHistoryRecord> ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY(
            Configuration configuration, UUID contributionIdInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY
                                .call(contributionIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_folder_obj_ref_history</code> as a table.
     */
    public static AdminDeleteFolderObjRefHistory ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY(UUID contributionIdInput) {
        return AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY.call(
                contributionIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder_obj_ref_history</code> as a table.
     */
    public static AdminDeleteFolderObjRefHistory ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY(Field<UUID> contributionIdInput) {
        return AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY.call(
                contributionIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_status</code>.
     */
    public static final AdminDeleteStatus ADMIN_DELETE_STATUS = AdminDeleteStatus.ADMIN_DELETE_STATUS;

    /**
     * Call <code>ehr.admin_delete_status</code>.
     */
    public static Result<AdminDeleteStatusRecord> ADMIN_DELETE_STATUS(Configuration configuration, UUID statusIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_status</code> as a table.
     */
    public static AdminDeleteStatus ADMIN_DELETE_STATUS(UUID statusIdInput) {
        return AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_status</code> as a table.
     */
    public static AdminDeleteStatus ADMIN_DELETE_STATUS(Field<UUID> statusIdInput) {
        return AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput);
    }

    /**
     * The table <code>ehr.admin_delete_status_history</code>.
     */
    public static final AdminDeleteStatusHistory ADMIN_DELETE_STATUS_HISTORY =
            AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY;

    /**
     * Call <code>ehr.admin_delete_status_history</code>.
     */
    public static Result<AdminDeleteStatusHistoryRecord> ADMIN_DELETE_STATUS_HISTORY(
            Configuration configuration, UUID statusIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY.call(
                        statusIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_status_history</code> as a table.
     */
    public static AdminDeleteStatusHistory ADMIN_DELETE_STATUS_HISTORY(UUID statusIdInput) {
        return AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY.call(statusIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_status_history</code> as a table.
     */
    public static AdminDeleteStatusHistory ADMIN_DELETE_STATUS_HISTORY(Field<UUID> statusIdInput) {
        return AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY.call(statusIdInput);
    }

    /**
     * The table <code>ehr.admin_get_linked_compositions</code>.
     */
    public static final AdminGetLinkedCompositions ADMIN_GET_LINKED_COMPOSITIONS =
            AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS;

    /**
     * Call <code>ehr.admin_get_linked_compositions</code>.
     */
    public static Result<AdminGetLinkedCompositionsRecord> ADMIN_GET_LINKED_COMPOSITIONS(
            Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS.call(
                        ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions</code> as a table.
     */
    public static AdminGetLinkedCompositions ADMIN_GET_LINKED_COMPOSITIONS(UUID ehrIdInput) {
        return AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions</code> as a table.
     */
    public static AdminGetLinkedCompositions ADMIN_GET_LINKED_COMPOSITIONS(Field<UUID> ehrIdInput) {
        return AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS.call(ehrIdInput);
    }

    /**
     * The table <code>ehr.admin_get_linked_compositions_for_contrib</code>.
     */
    public static final AdminGetLinkedCompositionsForContrib ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB =
            AdminGetLinkedCompositionsForContrib.ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB;

    /**
     * Call <code>ehr.admin_get_linked_compositions_for_contrib</code>.
     */
    public static Result<AdminGetLinkedCompositionsForContribRecord> ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB(
            Configuration configuration, UUID contribIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminGetLinkedCompositionsForContrib
                        .ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB
                        .call(contribIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions_for_contrib</code> as a
     * table.
     */
    public static AdminGetLinkedCompositionsForContrib ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB(UUID contribIdInput) {
        return AdminGetLinkedCompositionsForContrib.ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB
                .call(contribIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions_for_contrib</code> as a
     * table.
     */
    public static AdminGetLinkedCompositionsForContrib ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB(
            Field<UUID> contribIdInput) {
        return AdminGetLinkedCompositionsForContrib.ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB
                .call(contribIdInput);
    }

    /**
     * The table <code>ehr.admin_get_linked_contributions</code>.
     */
    public static final AdminGetLinkedContributions ADMIN_GET_LINKED_CONTRIBUTIONS =
            AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS;

    /**
     * Call <code>ehr.admin_get_linked_contributions</code>.
     */
    public static Result<AdminGetLinkedContributionsRecord> ADMIN_GET_LINKED_CONTRIBUTIONS(
            Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS.call(
                        ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_linked_contributions</code> as a table.
     */
    public static AdminGetLinkedContributions ADMIN_GET_LINKED_CONTRIBUTIONS(UUID ehrIdInput) {
        return AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_contributions</code> as a table.
     */
    public static AdminGetLinkedContributions ADMIN_GET_LINKED_CONTRIBUTIONS(Field<UUID> ehrIdInput) {
        return AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS.call(ehrIdInput);
    }

    /**
     * The table <code>ehr.admin_get_linked_status_for_contrib</code>.
     */
    public static final AdminGetLinkedStatusForContrib ADMIN_GET_LINKED_STATUS_FOR_CONTRIB =
            AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB;

    /**
     * Call <code>ehr.admin_get_linked_status_for_contrib</code>.
     */
    public static Result<AdminGetLinkedStatusForContribRecord> ADMIN_GET_LINKED_STATUS_FOR_CONTRIB(
            Configuration configuration, UUID contribIdInput) {
        return configuration
                .dsl()
                .selectFrom(
                        AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB
                                .call(contribIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_linked_status_for_contrib</code> as a table.
     */
    public static AdminGetLinkedStatusForContrib ADMIN_GET_LINKED_STATUS_FOR_CONTRIB(UUID contribIdInput) {
        return AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB.call(
                contribIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_status_for_contrib</code> as a table.
     */
    public static AdminGetLinkedStatusForContrib ADMIN_GET_LINKED_STATUS_FOR_CONTRIB(Field<UUID> contribIdInput) {
        return AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB.call(
                contribIdInput);
    }

    /**
     * The table <code>ehr.admin_get_template_usage</code>.
     */
    public static final AdminGetTemplateUsage ADMIN_GET_TEMPLATE_USAGE = AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE;

    /**
     * Call <code>ehr.admin_get_template_usage</code>.
     */
    public static Result<AdminGetTemplateUsageRecord> ADMIN_GET_TEMPLATE_USAGE(
            Configuration configuration, String targetId) {
        return configuration
                .dsl()
                .selectFrom(AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_template_usage</code> as a table.
     */
    public static AdminGetTemplateUsage ADMIN_GET_TEMPLATE_USAGE(String targetId) {
        return AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId);
    }

    /**
     * Get <code>ehr.admin_get_template_usage</code> as a table.
     */
    public static AdminGetTemplateUsage ADMIN_GET_TEMPLATE_USAGE(Field<String> targetId) {
        return AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId);
    }

    /**
     * The table <code>ehr.attestation</code>.
     */
    public static final Attestation ATTESTATION = Attestation.ATTESTATION;

    /**
     * The table <code>ehr.attestation_ref</code>.
     */
    public static final AttestationRef ATTESTATION_REF = AttestationRef.ATTESTATION_REF;

    /**
     * The table <code>ehr.attested_view</code>.
     */
    public static final AttestedView ATTESTED_VIEW = AttestedView.ATTESTED_VIEW;

    /**
     * The table <code>ehr.audit_details</code>.
     */
    public static final AuditDetails AUDIT_DETAILS = AuditDetails.AUDIT_DETAILS;

    /**
     * The table <code>ehr.compo_xref</code>.
     */
    public static final CompoXref COMPO_XREF = CompoXref.COMPO_XREF;

    /**
     * Composition table
     */
    public static final Composition COMPOSITION = Composition.COMPOSITION;

    /**
     * The table <code>ehr.composition_history</code>.
     */
    public static final CompositionHistory COMPOSITION_HISTORY = CompositionHistory.COMPOSITION_HISTORY;

    /**
     * openEHR common concepts (e.g. terminology) used in the system
     */
    public static final Concept CONCEPT = Concept.CONCEPT;

    /**
     * Contribution table, compositions reference this table
     */
    public static final Contribution CONTRIBUTION = Contribution.CONTRIBUTION;

    /**
     * EHR itself
     */
    public static final org.ehrbase.jooq.pg.tables.Ehr EHR_ = Ehr.EHR_;

    /**
     * this table hold the actual archetyped data values (fromBinder a template)
     */
    public static final Entry ENTRY = Entry.ENTRY;

    /**
     * The table <code>ehr.entry_history</code>.
     */
    public static final EntryHistory ENTRY_HISTORY = EntryHistory.ENTRY_HISTORY;

    /**
     * defines the context of an event (time, who, where... see openEHR IM 5.2
     */
    public static final EventContext EVENT_CONTEXT = EventContext.EVENT_CONTEXT;

    /**
     * The table <code>ehr.event_context_history</code>.
     */
    public static final EventContextHistory EVENT_CONTEXT_HISTORY = EventContextHistory.EVENT_CONTEXT_HISTORY;

    /**
     * The table <code>ehr.flyway_schema_history</code>.
     */
    public static final FlywaySchemaHistory FLYWAY_SCHEMA_HISTORY = FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY;

    /**
     * The table <code>ehr.folder</code>.
     */
    public static final Folder FOLDER = Folder.FOLDER;

    /**
     * The table <code>ehr.folder_hierarchy</code>.
     */
    public static final FolderHierarchy FOLDER_HIERARCHY = FolderHierarchy.FOLDER_HIERARCHY;

    /**
     * The table <code>ehr.folder_hierarchy_history</code>.
     */
    public static final FolderHierarchyHistory FOLDER_HIERARCHY_HISTORY =
            FolderHierarchyHistory.FOLDER_HIERARCHY_HISTORY;

    /**
     * The table <code>ehr.folder_history</code>.
     */
    public static final FolderHistory FOLDER_HISTORY = FolderHistory.FOLDER_HISTORY;

    /**
     * The table <code>ehr.folder_items</code>.
     */
    public static final FolderItems FOLDER_ITEMS = FolderItems.FOLDER_ITEMS;

    /**
     * The table <code>ehr.folder_items_history</code>.
     */
    public static final FolderItemsHistory FOLDER_ITEMS_HISTORY = FolderItemsHistory.FOLDER_ITEMS_HISTORY;

    /**
     * The table <code>ehr.heading</code>.
     */
    public static final Heading HEADING = Heading.HEADING;

    /**
     * specifies an identifier for a party identified, more than one identifier
     * is possible
     */
    public static final Identifier IDENTIFIER = Identifier.IDENTIFIER;

    /**
     * The table <code>ehr.jsonb_array_elements</code>.
     */
    public static final JsonbArrayElements JSONB_ARRAY_ELEMENTS = JsonbArrayElements.JSONB_ARRAY_ELEMENTS;

    /**
     * Call <code>ehr.jsonb_array_elements</code>.
     */
    public static Result<JsonbArrayElementsRecord> JSONB_ARRAY_ELEMENTS(Configuration configuration, JSONB jsonbVal) {
        return configuration
                .dsl()
                .selectFrom(JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal))
                .fetch();
    }

    /**
     * Get <code>ehr.jsonb_array_elements</code> as a table.
     */
    public static JsonbArrayElements JSONB_ARRAY_ELEMENTS(JSONB jsonbVal) {
        return JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal);
    }

    /**
     * Get <code>ehr.jsonb_array_elements</code> as a table.
     */
    public static JsonbArrayElements JSONB_ARRAY_ELEMENTS(Field<JSONB> jsonbVal) {
        return JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal);
    }

    /**
     * ISO 639-1 language codeset
     */
    public static final Language LANGUAGE = Language.LANGUAGE;

    /**
     * *implements
     * https://specifications.openehr.org/releases/RM/Release-1.0.3/support.html#_object_ref_class*id
     * implemented as native UID from postgres instead of a separate table.
     */
    public static final ObjectRef OBJECT_REF = ObjectRef.OBJECT_REF;

    /**
     * *implements
     * https://specifications.openehr.org/releases/RM/Release-1.0.3/support.html#_object_ref_history_class*id
     * implemented as native UID from postgres instead of a separate table.
     */
    public static final ObjectRefHistory OBJECT_REF_HISTORY = ObjectRefHistory.OBJECT_REF_HISTORY;

    /**
     * define a participating party for an event f.ex.
     */
    public static final Participation PARTICIPATION = Participation.PARTICIPATION;

    /**
     * The table <code>ehr.participation_history</code>.
     */
    public static final ParticipationHistory PARTICIPATION_HISTORY = ParticipationHistory.PARTICIPATION_HISTORY;

    /**
     * The table <code>ehr.party_identified</code>.
     */
    public static final PartyIdentified PARTY_IDENTIFIED = PartyIdentified.PARTY_IDENTIFIED;

    /**
     * The table <code>ehr.party_usage_identification</code>.
     */
    public static final PartyUsageIdentification PARTY_USAGE_IDENTIFICATION =
            PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION;

    /**
     * Call <code>ehr.party_usage_identification</code>.
     */
    public static Result<PartyUsageIdentificationRecord> PARTY_USAGE_IDENTIFICATION(
            Configuration configuration, UUID partyUuid) {
        return configuration
                .dsl()
                .selectFrom(
                        PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION.call(partyUuid))
                .fetch();
    }

    /**
     * Get <code>ehr.party_usage_identification</code> as a table.
     */
    public static PartyUsageIdentification PARTY_USAGE_IDENTIFICATION(UUID partyUuid) {
        return PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION.call(partyUuid);
    }

    /**
     * Get <code>ehr.party_usage_identification</code> as a table.
     */
    public static PartyUsageIdentification PARTY_USAGE_IDENTIFICATION(Field<UUID> partyUuid) {
        return PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION.call(partyUuid);
    }

    /**
     * key value store for plugin sub system
     */
    public static final Plugin PLUGIN = Plugin.PLUGIN;

    /**
     * The table <code>ehr.session_log</code>.
     */
    public static final SessionLog SESSION_LOG = SessionLog.SESSION_LOG;

    /**
     * specifies an ehr modality and ownership (patient)
     */
    public static final Status STATUS = Status.STATUS;

    /**
     * The table <code>ehr.status_history</code>.
     */
    public static final StatusHistory STATUS_HISTORY = StatusHistory.STATUS_HISTORY;

    /**
     * The table <code>ehr.stored_query</code>.
     */
    public static final StoredQuery STORED_QUERY = StoredQuery.STORED_QUERY;

    /**
     * system table for reference
     */
    public static final System SYSTEM = System.SYSTEM;

    /**
     * The table <code>ehr.template_store</code>.
     */
    public static final TemplateStore TEMPLATE_STORE = TemplateStore.TEMPLATE_STORE;

    /**
     * openEHR identified terminology provider
     */
    public static final TerminologyProvider TERMINOLOGY_PROVIDER = TerminologyProvider.TERMINOLOGY_PROVIDER;

    /**
     * ISO 3166-1 countries codeset
     */
    public static final Territory TERRITORY = Territory.TERRITORY;

    /**
     * The table <code>ehr.xjsonb_array_elements</code>.
     */
    public static final XjsonbArrayElements XJSONB_ARRAY_ELEMENTS = XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS;

    /**
     * Call <code>ehr.xjsonb_array_elements</code>.
     */
    public static Result<XjsonbArrayElementsRecord> XJSONB_ARRAY_ELEMENTS(Configuration configuration, JSONB entry) {
        return configuration
                .dsl()
                .selectFrom(XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry))
                .fetch();
    }

    /**
     * Get <code>ehr.xjsonb_array_elements</code> as a table.
     */
    public static XjsonbArrayElements XJSONB_ARRAY_ELEMENTS(JSONB entry) {
        return XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry);
    }

    /**
     * Get <code>ehr.xjsonb_array_elements</code> as a table.
     */
    public static XjsonbArrayElements XJSONB_ARRAY_ELEMENTS(Field<JSONB> entry) {
        return XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry);
    }
}
