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

import org.ehrbase.jooq.pg.tables.JsonbArrayElements;
import org.jooq.Field;
import org.jooq.JSONB;
import org.jooq.Record1;
import org.jooq.Row1;
import org.jooq.impl.TableRecordImpl;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class JsonbArrayElementsRecord extends TableRecordImpl<JsonbArrayElementsRecord> implements Record1<JSONB> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.jsonb_array_elements.jsonb_array_elements</code>.
     */
    public void setJsonbArrayElements(JSONB value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.jsonb_array_elements.jsonb_array_elements</code>.
     */
    public JSONB getJsonbArrayElements() {
        return (JSONB) get(0);
    }

    // -------------------------------------------------------------------------
    // Record1 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row1<JSONB> fieldsRow() {
        return (Row1) super.fieldsRow();
    }

    @Override
    public Row1<JSONB> valuesRow() {
        return (Row1) super.valuesRow();
    }

    @Override
    public Field<JSONB> field1() {
        return JsonbArrayElements.JSONB_ARRAY_ELEMENTS.JSONB_ARRAY_ELEMENTS_;
    }

    @Override
    public JSONB component1() {
        return getJsonbArrayElements();
    }

    @Override
    public JSONB value1() {
        return getJsonbArrayElements();
    }

    @Override
    public JsonbArrayElementsRecord value1(JSONB value) {
        setJsonbArrayElements(value);
        return this;
    }

    @Override
    public JsonbArrayElementsRecord values(JSONB value1) {
        value1(value1);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached JsonbArrayElementsRecord
     */
    public JsonbArrayElementsRecord() {
        super(JsonbArrayElements.JSONB_ARRAY_ELEMENTS);
    }

    /**
     * Create a detached, initialised JsonbArrayElementsRecord
     */
    public JsonbArrayElementsRecord(JSONB jsonbArrayElements) {
        super(JsonbArrayElements.JSONB_ARRAY_ELEMENTS);

        setJsonbArrayElements(jsonbArrayElements);
    }
}