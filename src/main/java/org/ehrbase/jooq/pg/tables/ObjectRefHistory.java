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
package org.ehrbase.jooq.pg.tables;

import java.sql.Timestamp;
import java.util.AbstractMap.SimpleEntry;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.ehrbase.jooq.pg.Indexes;
import org.ehrbase.jooq.pg.Keys;
import org.ehrbase.jooq.pg.tables.records.ObjectRefHistoryRecord;
import org.ehrbase.jooq.binding.SysPeriodBinder;
import org.ehrbase.jooq.pg.Ehr;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row6;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * *implements
 * https://specifications.openehr.org/releases/RM/Release-1.0.3/support.html#_object_ref_history_class*id
 * implemented as native UID from postgres instead of a separate table.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class ObjectRefHistory extends TableImpl<ObjectRefHistoryRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>ehr.object_ref_history</code>
     */
    public static final ObjectRefHistory OBJECT_REF_HISTORY = new ObjectRefHistory();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<ObjectRefHistoryRecord> getRecordType() {
        return ObjectRefHistoryRecord.class;
    }

    /**
     * The column <code>ehr.object_ref_history.id_namespace</code>.
     */
    public final TableField<ObjectRefHistoryRecord, String> ID_NAMESPACE =
            createField(DSL.name("id_namespace"), SQLDataType.CLOB.nullable(false), this, "");

    /**
     * The column <code>ehr.object_ref_history.type</code>.
     */
    public final TableField<ObjectRefHistoryRecord, String> TYPE =
            createField(DSL.name("type"), SQLDataType.CLOB.nullable(false), this, "");

    /**
     * The column <code>ehr.object_ref_history.id</code>.
     */
    public final TableField<ObjectRefHistoryRecord, UUID> ID =
            createField(DSL.name("id"), SQLDataType.UUID.nullable(false), this, "");

    /**
     * The column <code>ehr.object_ref_history.in_contribution</code>.
     */
    public final TableField<ObjectRefHistoryRecord, UUID> IN_CONTRIBUTION =
            createField(DSL.name("in_contribution"), SQLDataType.UUID.nullable(false), this, "");

    /**
     * The column <code>ehr.object_ref_history.sys_transaction</code>.
     */
    public final TableField<ObjectRefHistoryRecord, Timestamp> SYS_TRANSACTION =
            createField(DSL.name("sys_transaction"), SQLDataType.TIMESTAMP(6).nullable(false), this, "");

    /**
     * The column <code>ehr.object_ref_history.sys_period</code>.
     */
    public final TableField<ObjectRefHistoryRecord, SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>>
            SYS_PERIOD = createField(
                    DSL.name("sys_period"),
                    org.jooq.impl.DefaultDataType.getDefaultDataType("\"pg_catalog\".\"tstzrange\"")
                            .nullable(false),
                    this,
                    "",
                    new SysPeriodBinder());

    private ObjectRefHistory(Name alias, Table<ObjectRefHistoryRecord> aliased) {
        this(alias, aliased, null);
    }

    private ObjectRefHistory(Name alias, Table<ObjectRefHistoryRecord> aliased, Field<?>[] parameters) {
        super(
                alias,
                null,
                aliased,
                parameters,
                DSL.comment(
                        "*implements https://specifications.openehr.org/releases/RM/Release-1.0.3/support.html#_object_ref_history_class*id implemented as native UID from postgres instead of a separate table."),
                TableOptions.table());
    }

    /**
     * Create an aliased <code>ehr.object_ref_history</code> table reference
     */
    public ObjectRefHistory(String alias) {
        this(DSL.name(alias), OBJECT_REF_HISTORY);
    }

    /**
     * Create an aliased <code>ehr.object_ref_history</code> table reference
     */
    public ObjectRefHistory(Name alias) {
        this(alias, OBJECT_REF_HISTORY);
    }

    /**
     * Create a <code>ehr.object_ref_history</code> table reference
     */
    public ObjectRefHistory() {
        this(DSL.name("object_ref_history"), null);
    }

    public <O extends Record> ObjectRefHistory(Table<O> child, ForeignKey<O, ObjectRefHistoryRecord> key) {
        super(child, key, OBJECT_REF_HISTORY);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Ehr.EHR;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.OBJECT_REF_HISTORY_CONTRIBUTION_IDX);
    }

    @Override
    public UniqueKey<ObjectRefHistoryRecord> getPrimaryKey() {
        return Keys.OBJECT_REF_HIST_PKEY;
    }

    @Override
    public ObjectRefHistory as(String alias) {
        return new ObjectRefHistory(DSL.name(alias), this);
    }

    @Override
    public ObjectRefHistory as(Name alias) {
        return new ObjectRefHistory(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public ObjectRefHistory rename(String name) {
        return new ObjectRefHistory(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public ObjectRefHistory rename(Name name) {
        return new ObjectRefHistory(name, null);
    }

    // -------------------------------------------------------------------------
    // Row6 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row6<String, String, UUID, UUID, Timestamp, SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>>
            fieldsRow() {
        return (Row6) super.fieldsRow();
    }
}
