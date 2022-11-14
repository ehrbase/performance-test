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

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.ehrbase.jooq.pg.routines.AqlNodeNamePredicate;
import org.ehrbase.jooq.pg.routines.CamelToSnake;
import org.ehrbase.jooq.pg.routines.DeleteOrphanHistory;
import org.ehrbase.jooq.pg.routines.GetSystemVersion;
import org.ehrbase.jooq.pg.routines.JsArchetyped;
import org.ehrbase.jooq.pg.routines.JsAuditDetails;
import org.ehrbase.jooq.pg.routines.JsCanonicalDvQuantity;
import org.ehrbase.jooq.pg.routines.JsCanonicalGenericId;
import org.ehrbase.jooq.pg.routines.JsCanonicalObjectVersionId;
import org.ehrbase.jooq.pg.routines.JsCanonicalPartyRef;
import org.ehrbase.jooq.pg.routines.JsCodePhrase2;
import org.ehrbase.jooq.pg.routines.JsComposition1;
import org.ehrbase.jooq.pg.routines.JsComposition2;
import org.ehrbase.jooq.pg.routines.JsContext;
import org.ehrbase.jooq.pg.routines.JsContextSetting;
import org.ehrbase.jooq.pg.routines.JsDvCodedText1;
import org.ehrbase.jooq.pg.routines.JsDvCodedTextInner2;
import org.ehrbase.jooq.pg.routines.JsDvDateTime;
import org.ehrbase.jooq.pg.routines.JsFolder;
import org.ehrbase.jooq.pg.routines.JsParticipations;
import org.ehrbase.jooq.pg.routines.JsParty;
import org.ehrbase.jooq.pg.routines.JsPartyRef;
import org.ehrbase.jooq.pg.routines.JsPartySelf;
import org.ehrbase.jooq.pg.routines.JsPartySelfIdentified;
import org.ehrbase.jooq.pg.routines.JsonbExtractPath;
import org.ehrbase.jooq.pg.routines.MigrateConceptToDvCodedText;
import org.ehrbase.jooq.pg.routines.MigrateFolderAudit;
import org.ehrbase.jooq.pg.routines.MigrationAuditCommitter;
import org.ehrbase.jooq.pg.routines.ObjectVersionId;
import org.ehrbase.jooq.pg.routines.PartyUsage;
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
import org.ehrbase.jooq.pg.tables.PartyUsageIdentification;
import org.ehrbase.jooq.pg.tables.XjsonbArrayElements;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteCompositionRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteContributionRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrFullRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedCompositionsForContribRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedCompositionsRecord;
import org.ehrbase.jooq.pg.tables.records.JsonbArrayElementsRecord;
import org.ehrbase.jooq.pg.tables.records.XjsonbArrayElementsRecord;
import org.ehrbase.jooq.pg.udt.records.CodePhraseRecord;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.ehrbase.jooq.pg.enums.PartyRefIdType;
import org.ehrbase.jooq.pg.routines.AdminDeleteAllTemplates;
import org.ehrbase.jooq.pg.routines.AdminDeleteTemplate;
import org.ehrbase.jooq.pg.routines.AdminUpdateTemplate;
import org.ehrbase.jooq.pg.routines.CompositionName;
import org.ehrbase.jooq.pg.routines.CompositionUid;
import org.ehrbase.jooq.pg.routines.EhrStatusUid;
import org.ehrbase.jooq.pg.routines.FolderUid;
import org.ehrbase.jooq.pg.routines.IsoTimestamp;
import org.ehrbase.jooq.pg.routines.JsArchetypeDetails1;
import org.ehrbase.jooq.pg.routines.JsArchetypeDetails2;
import org.ehrbase.jooq.pg.routines.JsCanonicalHierObjectId1;
import org.ehrbase.jooq.pg.routines.JsCanonicalHierObjectId2;
import org.ehrbase.jooq.pg.routines.JsCanonicalObjectId;
import org.ehrbase.jooq.pg.routines.JsCanonicalParticipations;
import org.ehrbase.jooq.pg.routines.JsCanonicalPartyIdentified;
import org.ehrbase.jooq.pg.routines.JsCodePhrase1;
import org.ehrbase.jooq.pg.routines.JsConcept;
import org.ehrbase.jooq.pg.routines.JsContribution;
import org.ehrbase.jooq.pg.routines.JsDvCodedText2;
import org.ehrbase.jooq.pg.routines.JsDvCodedTextInner1;
import org.ehrbase.jooq.pg.routines.JsDvText;
import org.ehrbase.jooq.pg.routines.JsEhr;
import org.ehrbase.jooq.pg.routines.JsEhrStatus1;
import org.ehrbase.jooq.pg.routines.JsEhrStatus2;
import org.ehrbase.jooq.pg.routines.JsEhrStatusUid;
import org.ehrbase.jooq.pg.routines.JsObjectVersionId;
import org.ehrbase.jooq.pg.routines.JsPartyIdentified;
import org.ehrbase.jooq.pg.routines.JsTermMappings;
import org.ehrbase.jooq.pg.routines.JsTypedElementValue;
import org.ehrbase.jooq.pg.routines.JsonEntryMigrate;
import org.ehrbase.jooq.pg.routines.JsonPartyIdentified1;
import org.ehrbase.jooq.pg.routines.JsonPartyIdentified2;
import org.ehrbase.jooq.pg.routines.JsonPartyRelated;
import org.ehrbase.jooq.pg.routines.JsonPartySelf;
import org.ehrbase.jooq.pg.routines.JsonbExtractPathText;
import org.ehrbase.jooq.pg.routines.MapChangeTypeToCodestring;
import org.ehrbase.jooq.pg.routines.MigrateParticipationFunction;
import org.ehrbase.jooq.pg.routines.MigrateParticipationMode;
import org.ehrbase.jooq.pg.routines.MigrationAuditSystemId;
import org.ehrbase.jooq.pg.routines.MigrationAuditTzid;
import org.ehrbase.jooq.pg.routines.PartyRef;
import org.ehrbase.jooq.pg.tables.AdminDeleteAttestation;
import org.ehrbase.jooq.pg.tables.AdminDeleteEhr;
import org.ehrbase.jooq.pg.tables.AdminDeleteEhrHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteFolderObjRefHistory;
import org.ehrbase.jooq.pg.tables.AdminDeleteStatus;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedCompositions;
import org.ehrbase.jooq.pg.tables.AdminGetLinkedContributions;
import org.ehrbase.jooq.pg.tables.AdminGetTemplateUsage;
import org.ehrbase.jooq.pg.tables.JsonbArrayElements;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteAttestationRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteAuditRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteCompositionHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEhrHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteEventContextForCompoRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderObjRefHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteFolderRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteStatusHistoryRecord;
import org.ehrbase.jooq.pg.tables.records.AdminDeleteStatusRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedContributionsRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetLinkedStatusForContribRecord;
import org.ehrbase.jooq.pg.tables.records.AdminGetTemplateUsageRecord;
import org.ehrbase.jooq.pg.tables.records.PartyUsageIdentificationRecord;
import org.jooq.Configuration;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.JSONB;
import org.jooq.Result;

/**
 * Convenience access to all stored procedures and functions in ehr.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class Routines {

    /**
     * Call <code>ehr.admin_delete_all_templates</code>
     */
    public static Integer adminDeleteAllTemplates(Configuration configuration) {
        AdminDeleteAllTemplates f = new AdminDeleteAllTemplates();

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.admin_delete_all_templates</code> as a field.
     */
    public static Field<Integer> adminDeleteAllTemplates() {
        AdminDeleteAllTemplates f = new AdminDeleteAllTemplates();

        return f.asField();
    }

    /**
     * Call <code>ehr.admin_delete_template</code>
     */
    public static Integer adminDeleteTemplate(Configuration configuration, String targetId) {
        AdminDeleteTemplate f = new AdminDeleteTemplate();
        f.setTargetId(targetId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.admin_delete_template</code> as a field.
     */
    public static Field<Integer> adminDeleteTemplate(String targetId) {
        AdminDeleteTemplate f = new AdminDeleteTemplate();
        f.setTargetId(targetId);

        return f.asField();
    }

    /**
     * Get <code>ehr.admin_delete_template</code> as a field.
     */
    public static Field<Integer> adminDeleteTemplate(Field<String> targetId) {
        AdminDeleteTemplate f = new AdminDeleteTemplate();
        f.setTargetId(targetId);

        return f.asField();
    }

    /**
     * Call <code>ehr.admin_update_template</code>
     */
    public static String adminUpdateTemplate(Configuration configuration, String targetId, String updateContent) {
        AdminUpdateTemplate f = new AdminUpdateTemplate();
        f.setTargetId(targetId);
        f.setUpdateContent(updateContent);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.admin_update_template</code> as a field.
     */
    public static Field<String> adminUpdateTemplate(String targetId, String updateContent) {
        AdminUpdateTemplate f = new AdminUpdateTemplate();
        f.setTargetId(targetId);
        f.setUpdateContent(updateContent);

        return f.asField();
    }

    /**
     * Get <code>ehr.admin_update_template</code> as a field.
     */
    public static Field<String> adminUpdateTemplate(Field<String> targetId, Field<String> updateContent) {
        AdminUpdateTemplate f = new AdminUpdateTemplate();
        f.setTargetId(targetId);
        f.setUpdateContent(updateContent);

        return f.asField();
    }

    /**
     * Call <code>ehr.aql_node_name_predicate</code>
     */
    public static JSONB aqlNodeNamePredicate(
            Configuration configuration, JSONB entry, String nameValuePredicate, String jsonbPath) {
        AqlNodeNamePredicate f = new AqlNodeNamePredicate();
        f.setEntry(entry);
        f.setNameValuePredicate(nameValuePredicate);
        f.setJsonbPath(jsonbPath);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.aql_node_name_predicate</code> as a field.
     */
    public static Field<JSONB> aqlNodeNamePredicate(JSONB entry, String nameValuePredicate, String jsonbPath) {
        AqlNodeNamePredicate f = new AqlNodeNamePredicate();
        f.setEntry(entry);
        f.setNameValuePredicate(nameValuePredicate);
        f.setJsonbPath(jsonbPath);

        return f.asField();
    }

    /**
     * Get <code>ehr.aql_node_name_predicate</code> as a field.
     */
    public static Field<JSONB> aqlNodeNamePredicate(
            Field<JSONB> entry, Field<String> nameValuePredicate, Field<String> jsonbPath) {
        AqlNodeNamePredicate f = new AqlNodeNamePredicate();
        f.setEntry(entry);
        f.setNameValuePredicate(nameValuePredicate);
        f.setJsonbPath(jsonbPath);

        return f.asField();
    }

    /**
     * Call <code>ehr.camel_to_snake</code>
     */
    public static String camelToSnake(Configuration configuration, String literal) {
        CamelToSnake f = new CamelToSnake();
        f.setLiteral(literal);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.camel_to_snake</code> as a field.
     */
    public static Field<String> camelToSnake(String literal) {
        CamelToSnake f = new CamelToSnake();
        f.setLiteral(literal);

        return f.asField();
    }

    /**
     * Get <code>ehr.camel_to_snake</code> as a field.
     */
    public static Field<String> camelToSnake(Field<String> literal) {
        CamelToSnake f = new CamelToSnake();
        f.setLiteral(literal);

        return f.asField();
    }

    /**
     * Call <code>ehr.composition_name</code>
     */
    public static String compositionName(Configuration configuration, JSONB content) {
        CompositionName f = new CompositionName();
        f.setContent(content);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.composition_name</code> as a field.
     */
    public static Field<String> compositionName(JSONB content) {
        CompositionName f = new CompositionName();
        f.setContent(content);

        return f.asField();
    }

    /**
     * Get <code>ehr.composition_name</code> as a field.
     */
    public static Field<String> compositionName(Field<JSONB> content) {
        CompositionName f = new CompositionName();
        f.setContent(content);

        return f.asField();
    }

    /**
     * Call <code>ehr.composition_uid</code>
     */
    public static String compositionUid(Configuration configuration, UUID compositionUid, String serverId) {
        CompositionUid f = new CompositionUid();
        f.setCompositionUid(compositionUid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.composition_uid</code> as a field.
     */
    public static Field<String> compositionUid(UUID compositionUid, String serverId) {
        CompositionUid f = new CompositionUid();
        f.setCompositionUid(compositionUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.composition_uid</code> as a field.
     */
    public static Field<String> compositionUid(Field<UUID> compositionUid, Field<String> serverId) {
        CompositionUid f = new CompositionUid();
        f.setCompositionUid(compositionUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.delete_orphan_history</code>
     */
    public static Boolean deleteOrphanHistory(Configuration configuration) {
        DeleteOrphanHistory f = new DeleteOrphanHistory();

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.delete_orphan_history</code> as a field.
     */
    public static Field<Boolean> deleteOrphanHistory() {
        DeleteOrphanHistory f = new DeleteOrphanHistory();

        return f.asField();
    }

    /**
     * Call <code>ehr.ehr_status_uid</code>
     */
    public static String ehrStatusUid(Configuration configuration, UUID ehrUuid, String serverId) {
        EhrStatusUid f = new EhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.ehr_status_uid</code> as a field.
     */
    public static Field<String> ehrStatusUid(UUID ehrUuid, String serverId) {
        EhrStatusUid f = new EhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.ehr_status_uid</code> as a field.
     */
    public static Field<String> ehrStatusUid(Field<UUID> ehrUuid, Field<String> serverId) {
        EhrStatusUid f = new EhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.folder_uid</code>
     */
    public static String folderUid(Configuration configuration, UUID folderUid, String serverId) {
        FolderUid f = new FolderUid();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.folder_uid</code> as a field.
     */
    public static Field<String> folderUid(UUID folderUid, String serverId) {
        FolderUid f = new FolderUid();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.folder_uid</code> as a field.
     */
    public static Field<String> folderUid(Field<UUID> folderUid, Field<String> serverId) {
        FolderUid f = new FolderUid();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.get_system_version</code>
     */
    public static String getSystemVersion(Configuration configuration) {
        GetSystemVersion f = new GetSystemVersion();

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.get_system_version</code> as a field.
     */
    public static Field<String> getSystemVersion() {
        GetSystemVersion f = new GetSystemVersion();

        return f.asField();
    }

    /**
     * Call <code>ehr.iso_timestamp</code>
     */
    public static String isoTimestamp(Configuration configuration, OffsetDateTime __1) {
        IsoTimestamp f = new IsoTimestamp();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.iso_timestamp</code> as a field.
     */
    public static Field<String> isoTimestamp(OffsetDateTime __1) {
        IsoTimestamp f = new IsoTimestamp();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.iso_timestamp</code> as a field.
     */
    public static Field<String> isoTimestamp(Field<OffsetDateTime> __1) {
        IsoTimestamp f = new IsoTimestamp();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_archetype_details</code>
     */
    public static JSONB jsArchetypeDetails1(Configuration configuration, String archetypeNodeId, String templateId) {
        JsArchetypeDetails1 f = new JsArchetypeDetails1();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_archetype_details</code> as a field.
     */
    public static Field<JSONB> jsArchetypeDetails1(String archetypeNodeId, String templateId) {
        JsArchetypeDetails1 f = new JsArchetypeDetails1();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_archetype_details</code> as a field.
     */
    public static Field<JSONB> jsArchetypeDetails1(Field<String> archetypeNodeId, Field<String> templateId) {
        JsArchetypeDetails1 f = new JsArchetypeDetails1();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_archetype_details</code>
     */
    public static JSONB jsArchetypeDetails2(
            Configuration configuration, String archetypeNodeId, String templateId, String rmVersion) {
        JsArchetypeDetails2 f = new JsArchetypeDetails2();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);
        f.setRmVersion(rmVersion);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_archetype_details</code> as a field.
     */
    public static Field<JSONB> jsArchetypeDetails2(String archetypeNodeId, String templateId, String rmVersion) {
        JsArchetypeDetails2 f = new JsArchetypeDetails2();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);
        f.setRmVersion(rmVersion);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_archetype_details</code> as a field.
     */
    public static Field<JSONB> jsArchetypeDetails2(
            Field<String> archetypeNodeId, Field<String> templateId, Field<String> rmVersion) {
        JsArchetypeDetails2 f = new JsArchetypeDetails2();
        f.setArchetypeNodeId(archetypeNodeId);
        f.setTemplateId(templateId);
        f.setRmVersion(rmVersion);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_archetyped</code>
     */
    public static JSON jsArchetyped(Configuration configuration, String __1, String __2) {
        JsArchetyped f = new JsArchetyped();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_archetyped</code> as a field.
     */
    public static Field<JSON> jsArchetyped(String __1, String __2) {
        JsArchetyped f = new JsArchetyped();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_archetyped</code> as a field.
     */
    public static Field<JSON> jsArchetyped(Field<String> __1, Field<String> __2) {
        JsArchetyped f = new JsArchetyped();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_audit_details</code>
     */
    public static JSON jsAuditDetails(Configuration configuration, UUID __1) {
        JsAuditDetails f = new JsAuditDetails();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_audit_details</code> as a field.
     */
    public static Field<JSON> jsAuditDetails(UUID __1) {
        JsAuditDetails f = new JsAuditDetails();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_audit_details</code> as a field.
     */
    public static Field<JSON> jsAuditDetails(Field<UUID> __1) {
        JsAuditDetails f = new JsAuditDetails();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_dv_quantity</code>
     */
    public static JSON jsCanonicalDvQuantity(
            Configuration configuration, Double magnitude, String units, Integer _Precision, Boolean accuracyPercent) {
        JsCanonicalDvQuantity f = new JsCanonicalDvQuantity();
        f.setMagnitude(magnitude);
        f.setUnits(units);
        f.set_Precision(_Precision);
        f.setAccuracyPercent(accuracyPercent);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_dv_quantity</code> as a field.
     */
    public static Field<JSON> jsCanonicalDvQuantity(
            Double magnitude, String units, Integer _Precision, Boolean accuracyPercent) {
        JsCanonicalDvQuantity f = new JsCanonicalDvQuantity();
        f.setMagnitude(magnitude);
        f.setUnits(units);
        f.set_Precision(_Precision);
        f.setAccuracyPercent(accuracyPercent);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_dv_quantity</code> as a field.
     */
    public static Field<JSON> jsCanonicalDvQuantity(
            Field<Double> magnitude, Field<String> units, Field<Integer> _Precision, Field<Boolean> accuracyPercent) {
        JsCanonicalDvQuantity f = new JsCanonicalDvQuantity();
        f.setMagnitude(magnitude);
        f.setUnits(units);
        f.set_Precision(_Precision);
        f.setAccuracyPercent(accuracyPercent);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_generic_id</code>
     */
    public static JSON jsCanonicalGenericId(Configuration configuration, String scheme, String idValue) {
        JsCanonicalGenericId f = new JsCanonicalGenericId();
        f.setScheme(scheme);
        f.setIdValue(idValue);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_generic_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalGenericId(String scheme, String idValue) {
        JsCanonicalGenericId f = new JsCanonicalGenericId();
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_generic_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalGenericId(Field<String> scheme, Field<String> idValue) {
        JsCanonicalGenericId f = new JsCanonicalGenericId();
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_hier_object_id</code>
     */
    public static JSON jsCanonicalHierObjectId1(Configuration configuration, String idValue) {
        JsCanonicalHierObjectId1 f = new JsCanonicalHierObjectId1();
        f.setIdValue(idValue);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_hier_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalHierObjectId1(String idValue) {
        JsCanonicalHierObjectId1 f = new JsCanonicalHierObjectId1();
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_hier_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalHierObjectId1(Field<String> idValue) {
        JsCanonicalHierObjectId1 f = new JsCanonicalHierObjectId1();
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_hier_object_id</code>
     */
    public static JSON jsCanonicalHierObjectId2(Configuration configuration, UUID ehrId) {
        JsCanonicalHierObjectId2 f = new JsCanonicalHierObjectId2();
        f.setEhrId(ehrId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_hier_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalHierObjectId2(UUID ehrId) {
        JsCanonicalHierObjectId2 f = new JsCanonicalHierObjectId2();
        f.setEhrId(ehrId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_hier_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalHierObjectId2(Field<UUID> ehrId) {
        JsCanonicalHierObjectId2 f = new JsCanonicalHierObjectId2();
        f.setEhrId(ehrId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_object_id</code>
     */
    public static JSON jsCanonicalObjectId(
            Configuration configuration, PartyRefIdType objectidType, String scheme, String idValue) {
        JsCanonicalObjectId f = new JsCanonicalObjectId();
        f.setObjectidType(objectidType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalObjectId(PartyRefIdType objectidType, String scheme, String idValue) {
        JsCanonicalObjectId f = new JsCanonicalObjectId();
        f.setObjectidType(objectidType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_object_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalObjectId(
            Field<PartyRefIdType> objectidType, Field<String> scheme, Field<String> idValue) {
        JsCanonicalObjectId f = new JsCanonicalObjectId();
        f.setObjectidType(objectidType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_object_version_id</code>
     */
    public static JSON jsCanonicalObjectVersionId(Configuration configuration, String idValue) {
        JsCanonicalObjectVersionId f = new JsCanonicalObjectVersionId();
        f.setIdValue(idValue);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_object_version_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalObjectVersionId(String idValue) {
        JsCanonicalObjectVersionId f = new JsCanonicalObjectVersionId();
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_object_version_id</code> as a field.
     */
    public static Field<JSON> jsCanonicalObjectVersionId(Field<String> idValue) {
        JsCanonicalObjectVersionId f = new JsCanonicalObjectVersionId();
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_participations</code>
     */
    public static JSON jsCanonicalParticipations(Configuration configuration, UUID contextId) {
        JsCanonicalParticipations f = new JsCanonicalParticipations();
        f.setContextId(contextId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_participations</code> as a field.
     */
    public static Field<JSON> jsCanonicalParticipations(UUID contextId) {
        JsCanonicalParticipations f = new JsCanonicalParticipations();
        f.setContextId(contextId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_participations</code> as a field.
     */
    public static Field<JSON> jsCanonicalParticipations(Field<UUID> contextId) {
        JsCanonicalParticipations f = new JsCanonicalParticipations();
        f.setContextId(contextId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_party_identified</code>
     */
    public static JSON jsCanonicalPartyIdentified(Configuration configuration, UUID refid) {
        JsCanonicalPartyIdentified f = new JsCanonicalPartyIdentified();
        f.setRefid(refid);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_party_identified</code> as a field.
     */
    public static Field<JSON> jsCanonicalPartyIdentified(UUID refid) {
        JsCanonicalPartyIdentified f = new JsCanonicalPartyIdentified();
        f.setRefid(refid);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_party_identified</code> as a field.
     */
    public static Field<JSON> jsCanonicalPartyIdentified(Field<UUID> refid) {
        JsCanonicalPartyIdentified f = new JsCanonicalPartyIdentified();
        f.setRefid(refid);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_canonical_party_ref</code>
     */
    public static JSON jsCanonicalPartyRef(
            Configuration configuration, String namespace, String type, String scheme, String id) {
        JsCanonicalPartyRef f = new JsCanonicalPartyRef();
        f.setNamespace(namespace);
        f.setType(type);
        f.setScheme(scheme);
        f.setId(id);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_canonical_party_ref</code> as a field.
     */
    public static Field<JSON> jsCanonicalPartyRef(String namespace, String type, String scheme, String id) {
        JsCanonicalPartyRef f = new JsCanonicalPartyRef();
        f.setNamespace(namespace);
        f.setType(type);
        f.setScheme(scheme);
        f.setId(id);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_canonical_party_ref</code> as a field.
     */
    public static Field<JSON> jsCanonicalPartyRef(
            Field<String> namespace, Field<String> type, Field<String> scheme, Field<String> id) {
        JsCanonicalPartyRef f = new JsCanonicalPartyRef();
        f.setNamespace(namespace);
        f.setType(type);
        f.setScheme(scheme);
        f.setId(id);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_code_phrase</code>
     */
    public static JSON jsCodePhrase1(Configuration configuration, CodePhraseRecord codephrase) {
        JsCodePhrase1 f = new JsCodePhrase1();
        f.setCodephrase(codephrase);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_code_phrase</code> as a field.
     */
    public static Field<JSON> jsCodePhrase1(CodePhraseRecord codephrase) {
        JsCodePhrase1 f = new JsCodePhrase1();
        f.setCodephrase(codephrase);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_code_phrase</code> as a field.
     */
    public static Field<JSON> jsCodePhrase1(Field<CodePhraseRecord> codephrase) {
        JsCodePhrase1 f = new JsCodePhrase1();
        f.setCodephrase(codephrase);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_code_phrase</code>
     */
    public static JSON jsCodePhrase2(Configuration configuration, String __1, String __2) {
        JsCodePhrase2 f = new JsCodePhrase2();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_code_phrase</code> as a field.
     */
    public static Field<JSON> jsCodePhrase2(String __1, String __2) {
        JsCodePhrase2 f = new JsCodePhrase2();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_code_phrase</code> as a field.
     */
    public static Field<JSON> jsCodePhrase2(Field<String> __1, Field<String> __2) {
        JsCodePhrase2 f = new JsCodePhrase2();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_composition</code>
     */
    public static JSON jsComposition1(Configuration configuration, UUID __1) {
        JsComposition1 f = new JsComposition1();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_composition</code> as a field.
     */
    public static Field<JSON> jsComposition1(UUID __1) {
        JsComposition1 f = new JsComposition1();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_composition</code> as a field.
     */
    public static Field<JSON> jsComposition1(Field<UUID> __1) {
        JsComposition1 f = new JsComposition1();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_composition</code>
     */
    public static JSON jsComposition2(Configuration configuration, UUID __1, String serverNodeId) {
        JsComposition2 f = new JsComposition2();
        f.set__1(__1);
        f.setServerNodeId(serverNodeId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_composition</code> as a field.
     */
    public static Field<JSON> jsComposition2(UUID __1, String serverNodeId) {
        JsComposition2 f = new JsComposition2();
        f.set__1(__1);
        f.setServerNodeId(serverNodeId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_composition</code> as a field.
     */
    public static Field<JSON> jsComposition2(Field<UUID> __1, Field<String> serverNodeId) {
        JsComposition2 f = new JsComposition2();
        f.set__1(__1);
        f.setServerNodeId(serverNodeId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_concept</code>
     */
    public static JSON jsConcept(Configuration configuration, UUID __1) {
        JsConcept f = new JsConcept();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_concept</code> as a field.
     */
    public static Field<JSON> jsConcept(UUID __1) {
        JsConcept f = new JsConcept();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_concept</code> as a field.
     */
    public static Field<JSON> jsConcept(Field<UUID> __1) {
        JsConcept f = new JsConcept();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_context</code>
     */
    public static JSON jsContext(Configuration configuration, UUID __1) {
        JsContext f = new JsContext();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_context</code> as a field.
     */
    public static Field<JSON> jsContext(UUID __1) {
        JsContext f = new JsContext();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_context</code> as a field.
     */
    public static Field<JSON> jsContext(Field<UUID> __1) {
        JsContext f = new JsContext();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_context_setting</code>
     */
    public static JSON jsContextSetting(Configuration configuration, UUID __1) {
        JsContextSetting f = new JsContextSetting();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_context_setting</code> as a field.
     */
    public static Field<JSON> jsContextSetting(UUID __1) {
        JsContextSetting f = new JsContextSetting();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_context_setting</code> as a field.
     */
    public static Field<JSON> jsContextSetting(Field<UUID> __1) {
        JsContextSetting f = new JsContextSetting();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_contribution</code>
     */
    public static JSON jsContribution(Configuration configuration, UUID __1, String __2) {
        JsContribution f = new JsContribution();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_contribution</code> as a field.
     */
    public static Field<JSON> jsContribution(UUID __1, String __2) {
        JsContribution f = new JsContribution();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_contribution</code> as a field.
     */
    public static Field<JSON> jsContribution(Field<UUID> __1, Field<String> __2) {
        JsContribution f = new JsContribution();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_coded_text</code>
     */
    public static JSON jsDvCodedText1(Configuration configuration, DvCodedTextRecord dvcodedtext) {
        JsDvCodedText1 f = new JsDvCodedText1();
        f.setDvcodedtext(dvcodedtext);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_coded_text</code> as a field.
     */
    public static Field<JSON> jsDvCodedText1(DvCodedTextRecord dvcodedtext) {
        JsDvCodedText1 f = new JsDvCodedText1();
        f.setDvcodedtext(dvcodedtext);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_coded_text</code> as a field.
     */
    public static Field<JSON> jsDvCodedText1(Field<DvCodedTextRecord> dvcodedtext) {
        JsDvCodedText1 f = new JsDvCodedText1();
        f.setDvcodedtext(dvcodedtext);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_coded_text</code>
     */
    public static JSON jsDvCodedText2(Configuration configuration, String __1, JSON __2) {
        JsDvCodedText2 f = new JsDvCodedText2();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_coded_text</code> as a field.
     */
    public static Field<JSON> jsDvCodedText2(String __1, JSON __2) {
        JsDvCodedText2 f = new JsDvCodedText2();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_coded_text</code> as a field.
     */
    public static Field<JSON> jsDvCodedText2(Field<String> __1, Field<JSON> __2) {
        JsDvCodedText2 f = new JsDvCodedText2();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_coded_text_inner</code>
     */
    public static JSON jsDvCodedTextInner1(Configuration configuration, DvCodedTextRecord dvcodedtext) {
        JsDvCodedTextInner1 f = new JsDvCodedTextInner1();
        f.setDvcodedtext(dvcodedtext);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_coded_text_inner</code> as a field.
     */
    public static Field<JSON> jsDvCodedTextInner1(DvCodedTextRecord dvcodedtext) {
        JsDvCodedTextInner1 f = new JsDvCodedTextInner1();
        f.setDvcodedtext(dvcodedtext);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_coded_text_inner</code> as a field.
     */
    public static Field<JSON> jsDvCodedTextInner1(Field<DvCodedTextRecord> dvcodedtext) {
        JsDvCodedTextInner1 f = new JsDvCodedTextInner1();
        f.setDvcodedtext(dvcodedtext);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_coded_text_inner</code>
     */
    public static JSON jsDvCodedTextInner2(
            Configuration configuration, String value, String terminologyId, String codeString) {
        JsDvCodedTextInner2 f = new JsDvCodedTextInner2();
        f.setValue(value);
        f.setTerminologyId(terminologyId);
        f.setCodeString(codeString);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_coded_text_inner</code> as a field.
     */
    public static Field<JSON> jsDvCodedTextInner2(String value, String terminologyId, String codeString) {
        JsDvCodedTextInner2 f = new JsDvCodedTextInner2();
        f.setValue(value);
        f.setTerminologyId(terminologyId);
        f.setCodeString(codeString);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_coded_text_inner</code> as a field.
     */
    public static Field<JSON> jsDvCodedTextInner2(
            Field<String> value, Field<String> terminologyId, Field<String> codeString) {
        JsDvCodedTextInner2 f = new JsDvCodedTextInner2();
        f.setValue(value);
        f.setTerminologyId(terminologyId);
        f.setCodeString(codeString);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_date_time</code>
     */
    public static JSON jsDvDateTime(Configuration configuration, Timestamp __1, String __2) {
        JsDvDateTime f = new JsDvDateTime();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_date_time</code> as a field.
     */
    public static Field<JSON> jsDvDateTime(Timestamp __1, String __2) {
        JsDvDateTime f = new JsDvDateTime();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_date_time</code> as a field.
     */
    public static Field<JSON> jsDvDateTime(Field<Timestamp> __1, Field<String> __2) {
        JsDvDateTime f = new JsDvDateTime();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_dv_text</code>
     */
    public static JSON jsDvText(Configuration configuration, String __1) {
        JsDvText f = new JsDvText();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_dv_text</code> as a field.
     */
    public static Field<JSON> jsDvText(String __1) {
        JsDvText f = new JsDvText();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_dv_text</code> as a field.
     */
    public static Field<JSON> jsDvText(Field<String> __1) {
        JsDvText f = new JsDvText();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_ehr</code>
     */
    public static JSON jsEhr(Configuration configuration, UUID __1, String __2) {
        JsEhr f = new JsEhr();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_ehr</code> as a field.
     */
    public static Field<JSON> jsEhr(UUID __1, String __2) {
        JsEhr f = new JsEhr();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_ehr</code> as a field.
     */
    public static Field<JSON> jsEhr(Field<UUID> __1, Field<String> __2) {
        JsEhr f = new JsEhr();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_ehr_status</code>
     */
    public static JSON jsEhrStatus1(Configuration configuration, UUID __1) {
        JsEhrStatus1 f = new JsEhrStatus1();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_ehr_status</code> as a field.
     */
    public static Field<JSON> jsEhrStatus1(UUID __1) {
        JsEhrStatus1 f = new JsEhrStatus1();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_ehr_status</code> as a field.
     */
    public static Field<JSON> jsEhrStatus1(Field<UUID> __1) {
        JsEhrStatus1 f = new JsEhrStatus1();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_ehr_status</code>
     */
    public static JSON jsEhrStatus2(Configuration configuration, UUID ehrUuid, String serverId) {
        JsEhrStatus2 f = new JsEhrStatus2();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_ehr_status</code> as a field.
     */
    public static Field<JSON> jsEhrStatus2(UUID ehrUuid, String serverId) {
        JsEhrStatus2 f = new JsEhrStatus2();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_ehr_status</code> as a field.
     */
    public static Field<JSON> jsEhrStatus2(Field<UUID> ehrUuid, Field<String> serverId) {
        JsEhrStatus2 f = new JsEhrStatus2();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_ehr_status_uid</code>
     */
    public static JSONB jsEhrStatusUid(Configuration configuration, UUID ehrUuid, String serverId) {
        JsEhrStatusUid f = new JsEhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_ehr_status_uid</code> as a field.
     */
    public static Field<JSONB> jsEhrStatusUid(UUID ehrUuid, String serverId) {
        JsEhrStatusUid f = new JsEhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_ehr_status_uid</code> as a field.
     */
    public static Field<JSONB> jsEhrStatusUid(Field<UUID> ehrUuid, Field<String> serverId) {
        JsEhrStatusUid f = new JsEhrStatusUid();
        f.setEhrUuid(ehrUuid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_folder</code>
     */
    public static JSONB jsFolder(Configuration configuration, UUID folderUid, String serverId) {
        JsFolder f = new JsFolder();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_folder</code> as a field.
     */
    public static Field<JSONB> jsFolder(UUID folderUid, String serverId) {
        JsFolder f = new JsFolder();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_folder</code> as a field.
     */
    public static Field<JSONB> jsFolder(Field<UUID> folderUid, Field<String> serverId) {
        JsFolder f = new JsFolder();
        f.setFolderUid(folderUid);
        f.setServerId(serverId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_object_version_id</code>
     */
    public static JSONB jsObjectVersionId(Configuration configuration, String versionId) {
        JsObjectVersionId f = new JsObjectVersionId();
        f.setVersionId(versionId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_object_version_id</code> as a field.
     */
    public static Field<JSONB> jsObjectVersionId(String versionId) {
        JsObjectVersionId f = new JsObjectVersionId();
        f.setVersionId(versionId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_object_version_id</code> as a field.
     */
    public static Field<JSONB> jsObjectVersionId(Field<String> versionId) {
        JsObjectVersionId f = new JsObjectVersionId();
        f.setVersionId(versionId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_participations</code>
     */
    public static JSONB[] jsParticipations(Configuration configuration, UUID eventContextId) {
        JsParticipations f = new JsParticipations();
        f.setEventContextId(eventContextId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_participations</code> as a field.
     */
    public static Field<JSONB[]> jsParticipations(UUID eventContextId) {
        JsParticipations f = new JsParticipations();
        f.setEventContextId(eventContextId);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_participations</code> as a field.
     */
    public static Field<JSONB[]> jsParticipations(Field<UUID> eventContextId) {
        JsParticipations f = new JsParticipations();
        f.setEventContextId(eventContextId);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_party</code>
     */
    public static JSON jsParty(Configuration configuration, UUID __1) {
        JsParty f = new JsParty();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_party</code> as a field.
     */
    public static Field<JSON> jsParty(UUID __1) {
        JsParty f = new JsParty();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_party</code> as a field.
     */
    public static Field<JSON> jsParty(Field<UUID> __1) {
        JsParty f = new JsParty();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_party_identified</code>
     */
    public static JSON jsPartyIdentified(Configuration configuration, String __1, JSON __2) {
        JsPartyIdentified f = new JsPartyIdentified();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_party_identified</code> as a field.
     */
    public static Field<JSON> jsPartyIdentified(String __1, JSON __2) {
        JsPartyIdentified f = new JsPartyIdentified();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_party_identified</code> as a field.
     */
    public static Field<JSON> jsPartyIdentified(Field<String> __1, Field<JSON> __2) {
        JsPartyIdentified f = new JsPartyIdentified();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_party_ref</code>
     */
    public static JSON jsPartyRef(Configuration configuration, String __1, String __2, String __3, String __4) {
        JsPartyRef f = new JsPartyRef();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);
        f.set__4(__4);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_party_ref</code> as a field.
     */
    public static Field<JSON> jsPartyRef(String __1, String __2, String __3, String __4) {
        JsPartyRef f = new JsPartyRef();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);
        f.set__4(__4);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_party_ref</code> as a field.
     */
    public static Field<JSON> jsPartyRef(Field<String> __1, Field<String> __2, Field<String> __3, Field<String> __4) {
        JsPartyRef f = new JsPartyRef();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);
        f.set__4(__4);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_party_self</code>
     */
    public static JSON jsPartySelf(Configuration configuration, UUID __1) {
        JsPartySelf f = new JsPartySelf();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_party_self</code> as a field.
     */
    public static Field<JSON> jsPartySelf(UUID __1) {
        JsPartySelf f = new JsPartySelf();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_party_self</code> as a field.
     */
    public static Field<JSON> jsPartySelf(Field<UUID> __1) {
        JsPartySelf f = new JsPartySelf();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_party_self_identified</code>
     */
    public static JSON jsPartySelfIdentified(Configuration configuration, String __1, JSON __2) {
        JsPartySelfIdentified f = new JsPartySelfIdentified();
        f.set__1(__1);
        f.set__2(__2);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_party_self_identified</code> as a field.
     */
    public static Field<JSON> jsPartySelfIdentified(String __1, JSON __2) {
        JsPartySelfIdentified f = new JsPartySelfIdentified();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_party_self_identified</code> as a field.
     */
    public static Field<JSON> jsPartySelfIdentified(Field<String> __1, Field<JSON> __2) {
        JsPartySelfIdentified f = new JsPartySelfIdentified();
        f.set__1(__1);
        f.set__2(__2);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_term_mappings</code>
     */
    public static JSONB[] jsTermMappings(Configuration configuration, String[] mappings) {
        JsTermMappings f = new JsTermMappings();
        f.setMappings(mappings);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_term_mappings</code> as a field.
     */
    public static Field<JSONB[]> jsTermMappings(String[] mappings) {
        JsTermMappings f = new JsTermMappings();
        f.setMappings(mappings);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_term_mappings</code> as a field.
     */
    public static Field<JSONB[]> jsTermMappings(Field<String[]> mappings) {
        JsTermMappings f = new JsTermMappings();
        f.setMappings(mappings);

        return f.asField();
    }

    /**
     * Call <code>ehr.js_typed_element_value</code>
     */
    public static JSONB jsTypedElementValue(Configuration configuration, JSONB __1) {
        JsTypedElementValue f = new JsTypedElementValue();
        f.set__1(__1);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.js_typed_element_value</code> as a field.
     */
    public static Field<JSONB> jsTypedElementValue(JSONB __1) {
        JsTypedElementValue f = new JsTypedElementValue();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Get <code>ehr.js_typed_element_value</code> as a field.
     */
    public static Field<JSONB> jsTypedElementValue(Field<JSONB> __1) {
        JsTypedElementValue f = new JsTypedElementValue();
        f.set__1(__1);

        return f.asField();
    }

    /**
     * Call <code>ehr.json_entry_migrate</code>
     */
    public static JsonEntryMigrate jsonEntryMigrate(Configuration configuration, JSONB jsonbEntry) {
        JsonEntryMigrate p = new JsonEntryMigrate();
        p.setJsonbEntry(jsonbEntry);

        p.execute(configuration);
        return p;
    }

    /**
     * Call <code>ehr.json_party_identified</code>
     */
    public static JSON jsonPartyIdentified1(
            Configuration configuration,
            String name,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue) {
        JsonPartyIdentified1 f = new JsonPartyIdentified1();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.json_party_identified</code> as a field.
     */
    public static Field<JSON> jsonPartyIdentified1(
            String name, UUID refid, String namespace, String refType, String scheme, String idValue) {
        JsonPartyIdentified1 f = new JsonPartyIdentified1();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Get <code>ehr.json_party_identified</code> as a field.
     */
    public static Field<JSON> jsonPartyIdentified1(
            Field<String> name,
            Field<UUID> refid,
            Field<String> namespace,
            Field<String> refType,
            Field<String> scheme,
            Field<String> idValue) {
        JsonPartyIdentified1 f = new JsonPartyIdentified1();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);

        return f.asField();
    }

    /**
     * Call <code>ehr.json_party_identified</code>
     */
    public static JSON jsonPartyIdentified2(
            Configuration configuration,
            String name,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType) {
        JsonPartyIdentified2 f = new JsonPartyIdentified2();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.json_party_identified</code> as a field.
     */
    public static Field<JSON> jsonPartyIdentified2(
            String name,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType) {
        JsonPartyIdentified2 f = new JsonPartyIdentified2();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Get <code>ehr.json_party_identified</code> as a field.
     */
    public static Field<JSON> jsonPartyIdentified2(
            Field<String> name,
            Field<UUID> refid,
            Field<String> namespace,
            Field<String> refType,
            Field<String> scheme,
            Field<String> idValue,
            Field<PartyRefIdType> objectidType) {
        JsonPartyIdentified2 f = new JsonPartyIdentified2();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Call <code>ehr.json_party_related</code>
     */
    public static JSON jsonPartyRelated(
            Configuration configuration,
            String name,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType,
            DvCodedTextRecord relationship) {
        JsonPartyRelated f = new JsonPartyRelated();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);
        f.setRelationship(relationship);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.json_party_related</code> as a field.
     */
    public static Field<JSON> jsonPartyRelated(
            String name,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType,
            DvCodedTextRecord relationship) {
        JsonPartyRelated f = new JsonPartyRelated();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);
        f.setRelationship(relationship);

        return f.asField();
    }

    /**
     * Get <code>ehr.json_party_related</code> as a field.
     */
    public static Field<JSON> jsonPartyRelated(
            Field<String> name,
            Field<UUID> refid,
            Field<String> namespace,
            Field<String> refType,
            Field<String> scheme,
            Field<String> idValue,
            Field<PartyRefIdType> objectidType,
            Field<DvCodedTextRecord> relationship) {
        JsonPartyRelated f = new JsonPartyRelated();
        f.setName_(name);
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);
        f.setRelationship(relationship);

        return f.asField();
    }

    /**
     * Call <code>ehr.json_party_self</code>
     */
    public static JSON jsonPartySelf(
            Configuration configuration,
            UUID refid,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType) {
        JsonPartySelf f = new JsonPartySelf();
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.json_party_self</code> as a field.
     */
    public static Field<JSON> jsonPartySelf(
            UUID refid, String namespace, String refType, String scheme, String idValue, PartyRefIdType objectidType) {
        JsonPartySelf f = new JsonPartySelf();
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Get <code>ehr.json_party_self</code> as a field.
     */
    public static Field<JSON> jsonPartySelf(
            Field<UUID> refid,
            Field<String> namespace,
            Field<String> refType,
            Field<String> scheme,
            Field<String> idValue,
            Field<PartyRefIdType> objectidType) {
        JsonPartySelf f = new JsonPartySelf();
        f.setRefid(refid);
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Call <code>ehr.jsonb_extract_path</code>
     */
    public static JSONB jsonbExtractPath(Configuration configuration, JSONB fromJson, String[] pathElems) {
        JsonbExtractPath f = new JsonbExtractPath();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.jsonb_extract_path</code> as a field.
     */
    public static Field<JSONB> jsonbExtractPath(JSONB fromJson, String[] pathElems) {
        JsonbExtractPath f = new JsonbExtractPath();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        return f.asField();
    }

    /**
     * Get <code>ehr.jsonb_extract_path</code> as a field.
     */
    public static Field<JSONB> jsonbExtractPath(Field<JSONB> fromJson, Field<String[]> pathElems) {
        JsonbExtractPath f = new JsonbExtractPath();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        return f.asField();
    }

    /**
     * Call <code>ehr.jsonb_extract_path_text</code>
     */
    public static String jsonbExtractPathText(Configuration configuration, JSONB fromJson, String[] pathElems) {
        JsonbExtractPathText f = new JsonbExtractPathText();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.jsonb_extract_path_text</code> as a field.
     */
    public static Field<String> jsonbExtractPathText(JSONB fromJson, String[] pathElems) {
        JsonbExtractPathText f = new JsonbExtractPathText();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        return f.asField();
    }

    /**
     * Get <code>ehr.jsonb_extract_path_text</code> as a field.
     */
    public static Field<String> jsonbExtractPathText(Field<JSONB> fromJson, Field<String[]> pathElems) {
        JsonbExtractPathText f = new JsonbExtractPathText();
        f.setFromJson(fromJson);
        f.setPathElems(pathElems);

        return f.asField();
    }

    /**
     * Call <code>ehr.map_change_type_to_codestring</code>
     */
    public static String mapChangeTypeToCodestring(Configuration configuration, String literal) {
        MapChangeTypeToCodestring f = new MapChangeTypeToCodestring();
        f.setLiteral(literal);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.map_change_type_to_codestring</code> as a field.
     */
    public static Field<String> mapChangeTypeToCodestring(String literal) {
        MapChangeTypeToCodestring f = new MapChangeTypeToCodestring();
        f.setLiteral(literal);

        return f.asField();
    }

    /**
     * Get <code>ehr.map_change_type_to_codestring</code> as a field.
     */
    public static Field<String> mapChangeTypeToCodestring(Field<String> literal) {
        MapChangeTypeToCodestring f = new MapChangeTypeToCodestring();
        f.setLiteral(literal);

        return f.asField();
    }

    /**
     * Call <code>ehr.migrate_concept_to_dv_coded_text</code>
     */
    public static DvCodedTextRecord migrateConceptToDvCodedText(Configuration configuration, UUID conceptId) {
        MigrateConceptToDvCodedText f = new MigrateConceptToDvCodedText();
        f.setConceptId(conceptId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migrate_concept_to_dv_coded_text</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateConceptToDvCodedText(UUID conceptId) {
        MigrateConceptToDvCodedText f = new MigrateConceptToDvCodedText();
        f.setConceptId(conceptId);

        return f.asField();
    }

    /**
     * Get <code>ehr.migrate_concept_to_dv_coded_text</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateConceptToDvCodedText(Field<UUID> conceptId) {
        MigrateConceptToDvCodedText f = new MigrateConceptToDvCodedText();
        f.setConceptId(conceptId);

        return f.asField();
    }

    /**
     * Call <code>ehr.migrate_folder_audit</code>
     */
    public static UUID migrateFolderAudit(Configuration configuration) {
        MigrateFolderAudit p = new MigrateFolderAudit();

        p.execute(configuration);
        return p.getRetId();
    }

    /**
     * Call <code>ehr.migrate_participation_function</code>
     */
    public static DvCodedTextRecord migrateParticipationFunction(Configuration configuration, String mode) {
        MigrateParticipationFunction f = new MigrateParticipationFunction();
        f.setMode(mode);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migrate_participation_function</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateParticipationFunction(String mode) {
        MigrateParticipationFunction f = new MigrateParticipationFunction();
        f.setMode(mode);

        return f.asField();
    }

    /**
     * Get <code>ehr.migrate_participation_function</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateParticipationFunction(Field<String> mode) {
        MigrateParticipationFunction f = new MigrateParticipationFunction();
        f.setMode(mode);

        return f.asField();
    }

    /**
     * Call <code>ehr.migrate_participation_mode</code>
     */
    public static DvCodedTextRecord migrateParticipationMode(Configuration configuration, String mode) {
        MigrateParticipationMode f = new MigrateParticipationMode();
        f.setMode(mode);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migrate_participation_mode</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateParticipationMode(String mode) {
        MigrateParticipationMode f = new MigrateParticipationMode();
        f.setMode(mode);

        return f.asField();
    }

    /**
     * Get <code>ehr.migrate_participation_mode</code> as a field.
     */
    public static Field<DvCodedTextRecord> migrateParticipationMode(Field<String> mode) {
        MigrateParticipationMode f = new MigrateParticipationMode();
        f.setMode(mode);

        return f.asField();
    }

    /**
     * Call <code>ehr.migration_audit_committer</code>
     */
    public static UUID migrationAuditCommitter(Configuration configuration, UUID committer) {
        MigrationAuditCommitter f = new MigrationAuditCommitter();
        f.setCommitter(committer);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migration_audit_committer</code> as a field.
     */
    public static Field<UUID> migrationAuditCommitter(UUID committer) {
        MigrationAuditCommitter f = new MigrationAuditCommitter();
        f.setCommitter(committer);

        return f.asField();
    }

    /**
     * Get <code>ehr.migration_audit_committer</code> as a field.
     */
    public static Field<UUID> migrationAuditCommitter(Field<UUID> committer) {
        MigrationAuditCommitter f = new MigrationAuditCommitter();
        f.setCommitter(committer);

        return f.asField();
    }

    /**
     * Call <code>ehr.migration_audit_system_id</code>
     */
    public static UUID migrationAuditSystemId(Configuration configuration, UUID systemId) {
        MigrationAuditSystemId f = new MigrationAuditSystemId();
        f.setSystemId(systemId);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migration_audit_system_id</code> as a field.
     */
    public static Field<UUID> migrationAuditSystemId(UUID systemId) {
        MigrationAuditSystemId f = new MigrationAuditSystemId();
        f.setSystemId(systemId);

        return f.asField();
    }

    /**
     * Get <code>ehr.migration_audit_system_id</code> as a field.
     */
    public static Field<UUID> migrationAuditSystemId(Field<UUID> systemId) {
        MigrationAuditSystemId f = new MigrationAuditSystemId();
        f.setSystemId(systemId);

        return f.asField();
    }

    /**
     * Call <code>ehr.migration_audit_tzid</code>
     */
    public static String migrationAuditTzid(Configuration configuration, String timeCommittedTzid) {
        MigrationAuditTzid f = new MigrationAuditTzid();
        f.setTimeCommittedTzid(timeCommittedTzid);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.migration_audit_tzid</code> as a field.
     */
    public static Field<String> migrationAuditTzid(String timeCommittedTzid) {
        MigrationAuditTzid f = new MigrationAuditTzid();
        f.setTimeCommittedTzid(timeCommittedTzid);

        return f.asField();
    }

    /**
     * Get <code>ehr.migration_audit_tzid</code> as a field.
     */
    public static Field<String> migrationAuditTzid(Field<String> timeCommittedTzid) {
        MigrationAuditTzid f = new MigrationAuditTzid();
        f.setTimeCommittedTzid(timeCommittedTzid);

        return f.asField();
    }

    /**
     * Call <code>ehr.object_version_id</code>
     */
    public static JSON objectVersionId(Configuration configuration, UUID __1, String __2, Integer __3) {
        ObjectVersionId f = new ObjectVersionId();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.object_version_id</code> as a field.
     */
    public static Field<JSON> objectVersionId(UUID __1, String __2, Integer __3) {
        ObjectVersionId f = new ObjectVersionId();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);

        return f.asField();
    }

    /**
     * Get <code>ehr.object_version_id</code> as a field.
     */
    public static Field<JSON> objectVersionId(Field<UUID> __1, Field<String> __2, Field<Integer> __3) {
        ObjectVersionId f = new ObjectVersionId();
        f.set__1(__1);
        f.set__2(__2);
        f.set__3(__3);

        return f.asField();
    }

    /**
     * Call <code>ehr.party_ref</code>
     */
    public static JSONB partyRef(
            Configuration configuration,
            String namespace,
            String refType,
            String scheme,
            String idValue,
            PartyRefIdType objectidType) {
        PartyRef f = new PartyRef();
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.party_ref</code> as a field.
     */
    public static Field<JSONB> partyRef(
            String namespace, String refType, String scheme, String idValue, PartyRefIdType objectidType) {
        PartyRef f = new PartyRef();
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Get <code>ehr.party_ref</code> as a field.
     */
    public static Field<JSONB> partyRef(
            Field<String> namespace,
            Field<String> refType,
            Field<String> scheme,
            Field<String> idValue,
            Field<PartyRefIdType> objectidType) {
        PartyRef f = new PartyRef();
        f.setNamespace(namespace);
        f.setRefType(refType);
        f.setScheme(scheme);
        f.setIdValue(idValue);
        f.setObjectidType(objectidType);

        return f.asField();
    }

    /**
     * Call <code>ehr.party_usage</code>
     */
    public static Long partyUsage(Configuration configuration, UUID partyUuid) {
        PartyUsage f = new PartyUsage();
        f.setPartyUuid(partyUuid);

        f.execute(configuration);
        return f.getReturnValue();
    }

    /**
     * Get <code>ehr.party_usage</code> as a field.
     */
    public static Field<Long> partyUsage(UUID partyUuid) {
        PartyUsage f = new PartyUsage();
        f.setPartyUuid(partyUuid);

        return f.asField();
    }

    /**
     * Get <code>ehr.party_usage</code> as a field.
     */
    public static Field<Long> partyUsage(Field<UUID> partyUuid) {
        PartyUsage f = new PartyUsage();
        f.setPartyUuid(partyUuid);

        return f.asField();
    }

    /**
     * Call <code>ehr.admin_delete_attestation</code>.
     */
    public static Result<AdminDeleteAttestationRecord> adminDeleteAttestation(
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
    public static AdminDeleteAttestation adminDeleteAttestation(UUID attestRefInput) {
        return AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION.call(attestRefInput);
    }

    /**
     * Get <code>ehr.admin_delete_attestation</code> as a table.
     */
    public static AdminDeleteAttestation adminDeleteAttestation(Field<UUID> attestRefInput) {
        return AdminDeleteAttestation.ADMIN_DELETE_ATTESTATION.call(attestRefInput);
    }

    /**
     * Call <code>ehr.admin_delete_audit</code>.
     */
    public static Result<AdminDeleteAuditRecord> adminDeleteAudit(Configuration configuration, UUID auditInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_audit</code> as a table.
     */
    public static AdminDeleteAudit adminDeleteAudit(UUID auditInput) {
        return AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput);
    }

    /**
     * Get <code>ehr.admin_delete_audit</code> as a table.
     */
    public static AdminDeleteAudit adminDeleteAudit(Field<UUID> auditInput) {
        return AdminDeleteAudit.ADMIN_DELETE_AUDIT.call(auditInput);
    }

    /**
     * Call <code>ehr.admin_delete_composition</code>.
     */
    public static Result<AdminDeleteCompositionRecord> adminDeleteComposition(
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
    public static AdminDeleteComposition adminDeleteComposition(UUID compoIdInput) {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.call(compoIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_composition</code> as a table.
     */
    public static AdminDeleteComposition adminDeleteComposition(Field<UUID> compoIdInput) {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.call(compoIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_composition_history</code>.
     */
    public static Result<AdminDeleteCompositionHistoryRecord> adminDeleteCompositionHistory(
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
    public static AdminDeleteCompositionHistory adminDeleteCompositionHistory(UUID compoInput) {
        return AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY.call(
                compoInput);
    }

    /**
     * Get <code>ehr.admin_delete_composition_history</code> as a table.
     */
    public static AdminDeleteCompositionHistory adminDeleteCompositionHistory(Field<UUID> compoInput) {
        return AdminDeleteCompositionHistory.ADMIN_DELETE_COMPOSITION_HISTORY.call(
                compoInput);
    }

    /**
     * Call <code>ehr.admin_delete_contribution</code>.
     */
    public static Result<AdminDeleteContributionRecord> adminDeleteContribution(
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
    public static AdminDeleteContribution adminDeleteContribution(UUID contribIdInput) {
        return AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION.call(contribIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_contribution</code> as a table.
     */
    public static AdminDeleteContribution adminDeleteContribution(Field<UUID> contribIdInput) {
        return AdminDeleteContribution.ADMIN_DELETE_CONTRIBUTION.call(contribIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_ehr</code>.
     */
    public static Result<AdminDeleteEhrRecord> adminDeleteEhr(Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr</code> as a table.
     */
    public static AdminDeleteEhr adminDeleteEhr(UUID ehrIdInput) {
        return AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_ehr</code> as a table.
     */
    public static AdminDeleteEhr adminDeleteEhr(Field<UUID> ehrIdInput) {
        return AdminDeleteEhr.ADMIN_DELETE_EHR.call(ehrIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_ehr_full</code>.
     */
    public static Result<AdminDeleteEhrFullRecord> adminDeleteEhrFull(Configuration configuration, UUID ehrIdParam) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr_full</code> as a table.
     */
    public static AdminDeleteEhrFull adminDeleteEhrFull(UUID ehrIdParam) {
        return AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam);
    }

    /**
     * Get <code>ehr.admin_delete_ehr_full</code> as a table.
     */
    public static AdminDeleteEhrFull adminDeleteEhrFull(Field<UUID> ehrIdParam) {
        return AdminDeleteEhrFull.ADMIN_DELETE_EHR_FULL.call(ehrIdParam);
    }

    /**
     * Call <code>ehr.admin_delete_ehr_history</code>.
     */
    public static Result<AdminDeleteEhrHistoryRecord> adminDeleteEhrHistory(
            Configuration configuration, UUID ehrIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_ehr_history</code> as a table.
     */
    public static AdminDeleteEhrHistory adminDeleteEhrHistory(UUID ehrIdInput) {
        return AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_ehr_history</code> as a table.
     */
    public static AdminDeleteEhrHistory adminDeleteEhrHistory(Field<UUID> ehrIdInput) {
        return AdminDeleteEhrHistory.ADMIN_DELETE_EHR_HISTORY.call(ehrIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_event_context_for_compo</code>.
     */
    public static Result<AdminDeleteEventContextForCompoRecord> adminDeleteEventContextForCompo(
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
    public static AdminDeleteEventContextForCompo adminDeleteEventContextForCompo(UUID compoIdInput) {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.call(
                compoIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_event_context_for_compo</code> as a table.
     */
    public static AdminDeleteEventContextForCompo adminDeleteEventContextForCompo(Field<UUID> compoIdInput) {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.call(
                compoIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_folder</code>.
     */
    public static Result<AdminDeleteFolderRecord> adminDeleteFolder(Configuration configuration, UUID folderIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_folder</code> as a table.
     */
    public static AdminDeleteFolder adminDeleteFolder(UUID folderIdInput) {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder</code> as a table.
     */
    public static AdminDeleteFolder adminDeleteFolder(Field<UUID> folderIdInput) {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.call(folderIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_folder_history</code>.
     */
    public static Result<AdminDeleteFolderHistoryRecord> adminDeleteFolderHistory(
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
    public static AdminDeleteFolderHistory adminDeleteFolderHistory(UUID folderIdInput) {
        return AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY.call(folderIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder_history</code> as a table.
     */
    public static AdminDeleteFolderHistory adminDeleteFolderHistory(Field<UUID> folderIdInput) {
        return AdminDeleteFolderHistory.ADMIN_DELETE_FOLDER_HISTORY.call(folderIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_folder_obj_ref_history</code>.
     */
    public static Result<AdminDeleteFolderObjRefHistoryRecord> adminDeleteFolderObjRefHistory(
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
    public static AdminDeleteFolderObjRefHistory adminDeleteFolderObjRefHistory(UUID contributionIdInput) {
        return AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY.call(
                contributionIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_folder_obj_ref_history</code> as a table.
     */
    public static AdminDeleteFolderObjRefHistory adminDeleteFolderObjRefHistory(Field<UUID> contributionIdInput) {
        return AdminDeleteFolderObjRefHistory.ADMIN_DELETE_FOLDER_OBJ_REF_HISTORY.call(
                contributionIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_status</code>.
     */
    public static Result<AdminDeleteStatusRecord> adminDeleteStatus(Configuration configuration, UUID statusIdInput) {
        return configuration
                .dsl()
                .selectFrom(AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_delete_status</code> as a table.
     */
    public static AdminDeleteStatus adminDeleteStatus(UUID statusIdInput) {
        return AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_status</code> as a table.
     */
    public static AdminDeleteStatus adminDeleteStatus(Field<UUID> statusIdInput) {
        return AdminDeleteStatus.ADMIN_DELETE_STATUS.call(statusIdInput);
    }

    /**
     * Call <code>ehr.admin_delete_status_history</code>.
     */
    public static Result<AdminDeleteStatusHistoryRecord> adminDeleteStatusHistory(
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
    public static AdminDeleteStatusHistory adminDeleteStatusHistory(UUID statusIdInput) {
        return AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY.call(statusIdInput);
    }

    /**
     * Get <code>ehr.admin_delete_status_history</code> as a table.
     */
    public static AdminDeleteStatusHistory adminDeleteStatusHistory(Field<UUID> statusIdInput) {
        return AdminDeleteStatusHistory.ADMIN_DELETE_STATUS_HISTORY.call(statusIdInput);
    }

    /**
     * Call <code>ehr.admin_get_linked_compositions</code>.
     */
    public static Result<AdminGetLinkedCompositionsRecord> adminGetLinkedCompositions(
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
    public static AdminGetLinkedCompositions adminGetLinkedCompositions(UUID ehrIdInput) {
        return AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions</code> as a table.
     */
    public static AdminGetLinkedCompositions adminGetLinkedCompositions(Field<UUID> ehrIdInput) {
        return AdminGetLinkedCompositions.ADMIN_GET_LINKED_COMPOSITIONS.call(ehrIdInput);
    }

    /**
     * Call <code>ehr.admin_get_linked_compositions_for_contrib</code>.
     */
    public static Result<AdminGetLinkedCompositionsForContribRecord> adminGetLinkedCompositionsForContrib(
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
    public static AdminGetLinkedCompositionsForContrib adminGetLinkedCompositionsForContrib(UUID contribIdInput) {
        return AdminGetLinkedCompositionsForContrib.ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB
                .call(contribIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_compositions_for_contrib</code> as a
     * table.
     */
    public static AdminGetLinkedCompositionsForContrib adminGetLinkedCompositionsForContrib(
            Field<UUID> contribIdInput) {
        return AdminGetLinkedCompositionsForContrib.ADMIN_GET_LINKED_COMPOSITIONS_FOR_CONTRIB
                .call(contribIdInput);
    }

    /**
     * Call <code>ehr.admin_get_linked_contributions</code>.
     */
    public static Result<AdminGetLinkedContributionsRecord> adminGetLinkedContributions(
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
    public static AdminGetLinkedContributions adminGetLinkedContributions(UUID ehrIdInput) {
        return AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS.call(ehrIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_contributions</code> as a table.
     */
    public static AdminGetLinkedContributions adminGetLinkedContributions(Field<UUID> ehrIdInput) {
        return AdminGetLinkedContributions.ADMIN_GET_LINKED_CONTRIBUTIONS.call(ehrIdInput);
    }

    /**
     * Call <code>ehr.admin_get_linked_status_for_contrib</code>.
     */
    public static Result<AdminGetLinkedStatusForContribRecord> adminGetLinkedStatusForContrib(
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
    public static AdminGetLinkedStatusForContrib adminGetLinkedStatusForContrib(UUID contribIdInput) {
        return AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB.call(
                contribIdInput);
    }

    /**
     * Get <code>ehr.admin_get_linked_status_for_contrib</code> as a table.
     */
    public static AdminGetLinkedStatusForContrib adminGetLinkedStatusForContrib(Field<UUID> contribIdInput) {
        return AdminGetLinkedStatusForContrib.ADMIN_GET_LINKED_STATUS_FOR_CONTRIB.call(
                contribIdInput);
    }

    /**
     * Call <code>ehr.admin_get_template_usage</code>.
     */
    public static Result<AdminGetTemplateUsageRecord> adminGetTemplateUsage(
            Configuration configuration, String targetId) {
        return configuration
                .dsl()
                .selectFrom(AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId))
                .fetch();
    }

    /**
     * Get <code>ehr.admin_get_template_usage</code> as a table.
     */
    public static AdminGetTemplateUsage adminGetTemplateUsage(String targetId) {
        return AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId);
    }

    /**
     * Get <code>ehr.admin_get_template_usage</code> as a table.
     */
    public static AdminGetTemplateUsage adminGetTemplateUsage(Field<String> targetId) {
        return AdminGetTemplateUsage.ADMIN_GET_TEMPLATE_USAGE.call(targetId);
    }

    /**
     * Call <code>ehr.jsonb_array_elements</code>.
     */
    public static Result<JsonbArrayElementsRecord> jsonbArrayElements(Configuration configuration, JSONB jsonbVal) {
        return configuration
                .dsl()
                .selectFrom(JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal))
                .fetch();
    }

    /**
     * Get <code>ehr.jsonb_array_elements</code> as a table.
     */
    public static JsonbArrayElements jsonbArrayElements(JSONB jsonbVal) {
        return JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal);
    }

    /**
     * Get <code>ehr.jsonb_array_elements</code> as a table.
     */
    public static JsonbArrayElements jsonbArrayElements(Field<JSONB> jsonbVal) {
        return JsonbArrayElements.JSONB_ARRAY_ELEMENTS.call(jsonbVal);
    }

    /**
     * Call <code>ehr.party_usage_identification</code>.
     */
    public static Result<PartyUsageIdentificationRecord> partyUsageIdentification(
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
    public static PartyUsageIdentification partyUsageIdentification(UUID partyUuid) {
        return PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION.call(partyUuid);
    }

    /**
     * Get <code>ehr.party_usage_identification</code> as a table.
     */
    public static PartyUsageIdentification partyUsageIdentification(Field<UUID> partyUuid) {
        return PartyUsageIdentification.PARTY_USAGE_IDENTIFICATION.call(partyUuid);
    }

    /**
     * Call <code>ehr.xjsonb_array_elements</code>.
     */
    public static Result<XjsonbArrayElementsRecord> xjsonbArrayElements(Configuration configuration, JSONB entry) {
        return configuration
                .dsl()
                .selectFrom(XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry))
                .fetch();
    }

    /**
     * Get <code>ehr.xjsonb_array_elements</code> as a table.
     */
    public static XjsonbArrayElements xjsonbArrayElements(JSONB entry) {
        return XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry);
    }

    /**
     * Get <code>ehr.xjsonb_array_elements</code> as a table.
     */
    public static XjsonbArrayElements xjsonbArrayElements(Field<JSONB> entry) {
        return XjsonbArrayElements.XJSONB_ARRAY_ELEMENTS.call(entry);
    }
}
