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
package org.ehrbase.jooq.pg.routines;

import org.ehrbase.jooq.pg.Ehr;
import org.jooq.Field;
import org.jooq.JSON;
import org.jooq.Parameter;
import org.jooq.impl.AbstractRoutine;
import org.jooq.impl.Internal;
import org.jooq.impl.SQLDataType;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class JsDvCodedTextInner2 extends AbstractRoutine<JSON> {

    private static final long serialVersionUID = 1L;

    /**
     * The parameter <code>ehr.js_dv_coded_text_inner.RETURN_VALUE</code>.
     */
    public static final Parameter<JSON> RETURN_VALUE =
            Internal.createParameter("RETURN_VALUE", SQLDataType.JSON, false, false);

    /**
     * The parameter <code>ehr.js_dv_coded_text_inner.value</code>.
     */
    public static final Parameter<String> VALUE = Internal.createParameter("value", SQLDataType.CLOB, false, false);

    /**
     * The parameter <code>ehr.js_dv_coded_text_inner.terminology_id</code>.
     */
    public static final Parameter<String> TERMINOLOGY_ID =
            Internal.createParameter("terminology_id", SQLDataType.CLOB, false, false);

    /**
     * The parameter <code>ehr.js_dv_coded_text_inner.code_string</code>.
     */
    public static final Parameter<String> CODE_STRING =
            Internal.createParameter("code_string", SQLDataType.CLOB, false, false);

    /**
     * Create a new routine call instance
     */
    public JsDvCodedTextInner2() {
        super("js_dv_coded_text_inner", Ehr.EHR, SQLDataType.JSON);

        setReturnParameter(RETURN_VALUE);
        addInParameter(VALUE);
        addInParameter(TERMINOLOGY_ID);
        addInParameter(CODE_STRING);
        setOverloaded(true);
    }

    /**
     * Set the <code>value</code> parameter IN value to the routine
     */
    public void setValue(String value) {
        setValue(VALUE, value);
    }

    /**
     * Set the <code>value</code> parameter to the function to be used with a
     * {@link org.jooq.Select} statement
     */
    public void setValue(Field<String> field) {
        setField(VALUE, field);
    }

    /**
     * Set the <code>terminology_id</code> parameter IN value to the routine
     */
    public void setTerminologyId(String value) {
        setValue(TERMINOLOGY_ID, value);
    }

    /**
     * Set the <code>terminology_id</code> parameter to the function to be used
     * with a {@link org.jooq.Select} statement
     */
    public void setTerminologyId(Field<String> field) {
        setField(TERMINOLOGY_ID, field);
    }

    /**
     * Set the <code>code_string</code> parameter IN value to the routine
     */
    public void setCodeString(String value) {
        setValue(CODE_STRING, value);
    }

    /**
     * Set the <code>code_string</code> parameter to the function to be used
     * with a {@link org.jooq.Select} statement
     */
    public void setCodeString(Field<String> field) {
        setField(CODE_STRING, field);
    }
}