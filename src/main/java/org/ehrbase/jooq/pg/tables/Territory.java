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
import org.ehrbase.jooq.pg.Indexes;
import org.ehrbase.jooq.pg.Keys;
import org.ehrbase.jooq.pg.tables.records.TerritoryRecord;
import org.ehrbase.jooq.pg.Ehr;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row4;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * ISO 3166-1 countries codeset
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class Territory extends TableImpl<TerritoryRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>ehr.territory</code>
     */
    public static final Territory TERRITORY = new Territory();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<TerritoryRecord> getRecordType() {
        return TerritoryRecord.class;
    }

    /**
     * The column <code>ehr.territory.code</code>.
     */
    public final TableField<TerritoryRecord, Integer> CODE =
            createField(DSL.name("code"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>ehr.territory.twoletter</code>.
     */
    public final TableField<TerritoryRecord, String> TWOLETTER =
            createField(DSL.name("twoletter"), SQLDataType.CHAR(2), this, "");

    /**
     * The column <code>ehr.territory.threeletter</code>.
     */
    public final TableField<TerritoryRecord, String> THREELETTER =
            createField(DSL.name("threeletter"), SQLDataType.CHAR(3), this, "");

    /**
     * The column <code>ehr.territory.text</code>.
     */
    public final TableField<TerritoryRecord, String> TEXT =
            createField(DSL.name("text"), SQLDataType.CLOB.nullable(false), this, "");

    private Territory(Name alias, Table<TerritoryRecord> aliased) {
        this(alias, aliased, null);
    }

    private Territory(Name alias, Table<TerritoryRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment("ISO 3166-1 countries codeset"), TableOptions.table());
    }

    /**
     * Create an aliased <code>ehr.territory</code> table reference
     */
    public Territory(String alias) {
        this(DSL.name(alias), TERRITORY);
    }

    /**
     * Create an aliased <code>ehr.territory</code> table reference
     */
    public Territory(Name alias) {
        this(alias, TERRITORY);
    }

    /**
     * Create a <code>ehr.territory</code> table reference
     */
    public Territory() {
        this(DSL.name("territory"), null);
    }

    public <O extends Record> Territory(Table<O> child, ForeignKey<O, TerritoryRecord> key) {
        super(child, key, TERRITORY);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Ehr.EHR;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.EHR_TERRITORY_TWOLETTER_IDX, Indexes.TERRITORY_CODE_INDEX);
    }

    @Override
    public UniqueKey<TerritoryRecord> getPrimaryKey() {
        return Keys.TERRITORY_PKEY;
    }

    @Override
    public Territory as(String alias) {
        return new Territory(DSL.name(alias), this);
    }

    @Override
    public Territory as(Name alias) {
        return new Territory(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Territory rename(String name) {
        return new Territory(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Territory rename(Name name) {
        return new Territory(name, null);
    }

    // -------------------------------------------------------------------------
    // Row4 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row4<Integer, String, String, String> fieldsRow() {
        return (Row4) super.fieldsRow();
    }
}
