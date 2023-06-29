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
import org.ehrbase.jooq.pg.tables.AdminDeleteComposition;
import org.jooq.Field;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.TableRecordImpl;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class AdminDeleteCompositionRecord extends TableRecordImpl<AdminDeleteCompositionRecord>
        implements Record5<Integer, UUID, UUID, UUID, UUID> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.admin_delete_composition.num</code>.
     */
    public void setNum(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_composition.num</code>.
     */
    public Integer getNum() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>ehr.admin_delete_composition.contribution</code>.
     */
    public void setContribution(UUID value) {
        set(1, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_composition.contribution</code>.
     */
    public UUID getContribution() {
        return (UUID) get(1);
    }

    /**
     * Setter for <code>ehr.admin_delete_composition.party</code>.
     */
    public void setParty(UUID value) {
        set(2, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_composition.party</code>.
     */
    public UUID getParty() {
        return (UUID) get(2);
    }

    /**
     * Setter for <code>ehr.admin_delete_composition.audit</code>.
     */
    public void setAudit(UUID value) {
        set(3, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_composition.audit</code>.
     */
    public UUID getAudit() {
        return (UUID) get(3);
    }

    /**
     * Setter for <code>ehr.admin_delete_composition.attestation</code>.
     */
    public void setAttestation(UUID value) {
        set(4, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_composition.attestation</code>.
     */
    public UUID getAttestation() {
        return (UUID) get(4);
    }

    // -------------------------------------------------------------------------
    // Record5 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row5<Integer, UUID, UUID, UUID, UUID> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Integer, UUID, UUID, UUID, UUID> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.NUM;
    }

    @Override
    public Field<UUID> field2() {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.CONTRIBUTION;
    }

    @Override
    public Field<UUID> field3() {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.PARTY;
    }

    @Override
    public Field<UUID> field4() {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.AUDIT;
    }

    @Override
    public Field<UUID> field5() {
        return AdminDeleteComposition.ADMIN_DELETE_COMPOSITION.ATTESTATION;
    }

    @Override
    public Integer component1() {
        return getNum();
    }

    @Override
    public UUID component2() {
        return getContribution();
    }

    @Override
    public UUID component3() {
        return getParty();
    }

    @Override
    public UUID component4() {
        return getAudit();
    }

    @Override
    public UUID component5() {
        return getAttestation();
    }

    @Override
    public Integer value1() {
        return getNum();
    }

    @Override
    public UUID value2() {
        return getContribution();
    }

    @Override
    public UUID value3() {
        return getParty();
    }

    @Override
    public UUID value4() {
        return getAudit();
    }

    @Override
    public UUID value5() {
        return getAttestation();
    }

    @Override
    public AdminDeleteCompositionRecord value1(Integer value) {
        setNum(value);
        return this;
    }

    @Override
    public AdminDeleteCompositionRecord value2(UUID value) {
        setContribution(value);
        return this;
    }

    @Override
    public AdminDeleteCompositionRecord value3(UUID value) {
        setParty(value);
        return this;
    }

    @Override
    public AdminDeleteCompositionRecord value4(UUID value) {
        setAudit(value);
        return this;
    }

    @Override
    public AdminDeleteCompositionRecord value5(UUID value) {
        setAttestation(value);
        return this;
    }

    @Override
    public AdminDeleteCompositionRecord values(Integer value1, UUID value2, UUID value3, UUID value4, UUID value5) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached AdminDeleteCompositionRecord
     */
    public AdminDeleteCompositionRecord() {
        super(AdminDeleteComposition.ADMIN_DELETE_COMPOSITION);
    }

    /**
     * Create a detached, initialised AdminDeleteCompositionRecord
     */
    public AdminDeleteCompositionRecord(Integer num, UUID contribution, UUID party, UUID audit, UUID attestation) {
        super(AdminDeleteComposition.ADMIN_DELETE_COMPOSITION);

        setNum(num);
        setContribution(contribution);
        setParty(party);
        setAudit(audit);
        setAttestation(attestation);
    }
}