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
package org.ehrbase.jooq.pg.tables.records;

import java.util.UUID;
import org.ehrbase.jooq.pg.tables.AdminDeleteEventContextForCompo;
import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Row2;
import org.jooq.impl.TableRecordImpl;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class AdminDeleteEventContextForCompoRecord extends TableRecordImpl<AdminDeleteEventContextForCompoRecord>
        implements Record2<Integer, UUID> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.admin_delete_event_context_for_compo.num</code>.
     */
    public void setNum(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_event_context_for_compo.num</code>.
     */
    public Integer getNum() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>ehr.admin_delete_event_context_for_compo.party</code>.
     */
    public void setParty(UUID value) {
        set(1, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_event_context_for_compo.party</code>.
     */
    public UUID getParty() {
        return (UUID) get(1);
    }

    // -------------------------------------------------------------------------
    // Record2 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row2<Integer, UUID> fieldsRow() {
        return (Row2) super.fieldsRow();
    }

    @Override
    public Row2<Integer, UUID> valuesRow() {
        return (Row2) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.NUM;
    }

    @Override
    public Field<UUID> field2() {
        return AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO.PARTY;
    }

    @Override
    public Integer component1() {
        return getNum();
    }

    @Override
    public UUID component2() {
        return getParty();
    }

    @Override
    public Integer value1() {
        return getNum();
    }

    @Override
    public UUID value2() {
        return getParty();
    }

    @Override
    public AdminDeleteEventContextForCompoRecord value1(Integer value) {
        setNum(value);
        return this;
    }

    @Override
    public AdminDeleteEventContextForCompoRecord value2(UUID value) {
        setParty(value);
        return this;
    }

    @Override
    public AdminDeleteEventContextForCompoRecord values(Integer value1, UUID value2) {
        value1(value1);
        value2(value2);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached AdminDeleteEventContextForCompoRecord
     */
    public AdminDeleteEventContextForCompoRecord() {
        super(AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO);
    }

    /**
     * Create a detached, initialised AdminDeleteEventContextForCompoRecord
     */
    public AdminDeleteEventContextForCompoRecord(Integer num, UUID party) {
        super(AdminDeleteEventContextForCompo.ADMIN_DELETE_EVENT_CONTEXT_FOR_COMPO);

        setNum(num);
        setParty(party);
    }
}