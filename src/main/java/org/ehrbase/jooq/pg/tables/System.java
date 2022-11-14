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

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.ehrbase.jooq.pg.Indexes;
import org.ehrbase.jooq.pg.Keys;
import org.ehrbase.jooq.pg.Ehr;
import org.ehrbase.jooq.pg.tables.records.SystemRecord;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row3;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * system table for reference
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class System extends TableImpl<SystemRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>ehr.system</code>
     */
    public static final System SYSTEM = new System();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<SystemRecord> getRecordType() {
        return SystemRecord.class;
    }

    /**
     * The column <code>ehr.system.id</code>.
     */
    public final TableField<SystemRecord, UUID> ID = createField(
            DSL.name("id"),
            SQLDataType.UUID.nullable(false).defaultValue(DSL.field("uuid_generate_v4()", SQLDataType.UUID)),
            this,
            "");

    /**
     * The column <code>ehr.system.description</code>.
     */
    public final TableField<SystemRecord, String> DESCRIPTION =
            createField(DSL.name("description"), SQLDataType.CLOB.nullable(false), this, "");

    /**
     * The column <code>ehr.system.settings</code>.
     */
    public final TableField<SystemRecord, String> SETTINGS =
            createField(DSL.name("settings"), SQLDataType.CLOB.nullable(false), this, "");

    private System(Name alias, Table<SystemRecord> aliased) {
        this(alias, aliased, null);
    }

    private System(Name alias, Table<SystemRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment("system table for reference"), TableOptions.table());
    }

    /**
     * Create an aliased <code>ehr.system</code> table reference
     */
    public System(String alias) {
        this(DSL.name(alias), SYSTEM);
    }

    /**
     * Create an aliased <code>ehr.system</code> table reference
     */
    public System(Name alias) {
        this(alias, SYSTEM);
    }

    /**
     * Create a <code>ehr.system</code> table reference
     */
    public System() {
        this(DSL.name("system"), null);
    }

    public <O extends Record> System(Table<O> child, ForeignKey<O, SystemRecord> key) {
        super(child, key, SYSTEM);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Ehr.EHR;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.EHR_SYSTEM_SETTINGS_IDX);
    }

    @Override
    public UniqueKey<SystemRecord> getPrimaryKey() {
        return Keys.SYSTEM_PKEY;
    }

    @Override
    public System as(String alias) {
        return new System(DSL.name(alias), this);
    }

    @Override
    public System as(Name alias) {
        return new System(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public System rename(String name) {
        return new System(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public System rename(Name name) {
        return new System(name, null);
    }

    // -------------------------------------------------------------------------
    // Row3 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row3<UUID, String, String> fieldsRow() {
        return (Row3) super.fieldsRow();
    }
}
