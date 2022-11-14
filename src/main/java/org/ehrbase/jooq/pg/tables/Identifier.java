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
import org.ehrbase.jooq.pg.tables.records.IdentifierRecord;
import org.ehrbase.jooq.pg.Ehr;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row5;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * specifies an identifier for a party identified, more than one identifier is
 * possible
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class Identifier extends TableImpl<IdentifierRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>ehr.identifier</code>
     */
    public static final Identifier IDENTIFIER = new Identifier();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<IdentifierRecord> getRecordType() {
        return IdentifierRecord.class;
    }

    /**
     * The column <code>ehr.identifier.id_value</code>.
     */
    public final TableField<IdentifierRecord, String> ID_VALUE =
            createField(DSL.name("id_value"), SQLDataType.CLOB, this, "");

    /**
     * The column <code>ehr.identifier.issuer</code>.
     */
    public final TableField<IdentifierRecord, String> ISSUER =
            createField(DSL.name("issuer"), SQLDataType.CLOB, this, "");

    /**
     * The column <code>ehr.identifier.assigner</code>.
     */
    public final TableField<IdentifierRecord, String> ASSIGNER =
            createField(DSL.name("assigner"), SQLDataType.CLOB, this, "");

    /**
     * The column <code>ehr.identifier.type_name</code>.
     */
    public final TableField<IdentifierRecord, String> TYPE_NAME =
            createField(DSL.name("type_name"), SQLDataType.CLOB, this, "");

    /**
     * The column <code>ehr.identifier.party</code>.
     */
    public final TableField<IdentifierRecord, UUID> PARTY =
            createField(DSL.name("party"), SQLDataType.UUID.nullable(false), this, "");

    private Identifier(Name alias, Table<IdentifierRecord> aliased) {
        this(alias, aliased, null);
    }

    private Identifier(Name alias, Table<IdentifierRecord> aliased, Field<?>[] parameters) {
        super(
                alias,
                null,
                aliased,
                parameters,
                DSL.comment("specifies an identifier for a party identified, more than one identifier is possible"),
                TableOptions.table());
    }

    /**
     * Create an aliased <code>ehr.identifier</code> table reference
     */
    public Identifier(String alias) {
        this(DSL.name(alias), IDENTIFIER);
    }

    /**
     * Create an aliased <code>ehr.identifier</code> table reference
     */
    public Identifier(Name alias) {
        this(alias, IDENTIFIER);
    }

    /**
     * Create a <code>ehr.identifier</code> table reference
     */
    public Identifier() {
        this(DSL.name("identifier"), null);
    }

    public <O extends Record> Identifier(Table<O> child, ForeignKey<O, IdentifierRecord> key) {
        super(child, key, IDENTIFIER);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Ehr.EHR;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.EHR_IDENTIFIER_PARTY_IDX, Indexes.IDENTIFIER_VALUE_IDX);
    }

    @Override
    public List<ForeignKey<IdentifierRecord, ?>> getReferences() {
        return Arrays.asList(Keys.IDENTIFIER__IDENTIFIER_PARTY_FKEY);
    }

    private transient PartyIdentified _partyIdentified;

    /**
     * Get the implicit join path to the <code>ehr.party_identified</code>
     * table.
     */
    public PartyIdentified partyIdentified() {
        if (_partyIdentified == null)
            _partyIdentified = new PartyIdentified(this, Keys.IDENTIFIER__IDENTIFIER_PARTY_FKEY);

        return _partyIdentified;
    }

    @Override
    public Identifier as(String alias) {
        return new Identifier(DSL.name(alias), this);
    }

    @Override
    public Identifier as(Name alias) {
        return new Identifier(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Identifier rename(String name) {
        return new Identifier(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Identifier rename(Name name) {
        return new Identifier(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<String, String, String, String, UUID> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
