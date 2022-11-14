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

import com.nedap.archie.rm.datastructures.ItemStructure;
import java.sql.Timestamp;
import java.util.AbstractMap.SimpleEntry;
import java.util.UUID;
import org.ehrbase.jooq.pg.tables.Status;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record13;
import org.jooq.Row13;
import org.jooq.impl.UpdatableRecordImpl;

/**
 * specifies an ehr modality and ownership (patient)
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class StatusRecord extends UpdatableRecordImpl<StatusRecord>
        implements Record13<
                UUID,
                UUID,
                Boolean,
                Boolean,
                UUID,
                ItemStructure,
                Timestamp,
                SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>,
                UUID,
                UUID,
                UUID,
                String,
        DvCodedTextRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.status.id</code>.
     */
    public void setId(UUID value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.status.id</code>.
     */
    public UUID getId() {
        return (UUID) get(0);
    }

    /**
     * Setter for <code>ehr.status.ehr_id</code>.
     */
    public void setEhrId(UUID value) {
        set(1, value);
    }

    /**
     * Getter for <code>ehr.status.ehr_id</code>.
     */
    public UUID getEhrId() {
        return (UUID) get(1);
    }

    /**
     * Setter for <code>ehr.status.is_queryable</code>.
     */
    public void setIsQueryable(Boolean value) {
        set(2, value);
    }

    /**
     * Getter for <code>ehr.status.is_queryable</code>.
     */
    public Boolean getIsQueryable() {
        return (Boolean) get(2);
    }

    /**
     * Setter for <code>ehr.status.is_modifiable</code>.
     */
    public void setIsModifiable(Boolean value) {
        set(3, value);
    }

    /**
     * Getter for <code>ehr.status.is_modifiable</code>.
     */
    public Boolean getIsModifiable() {
        return (Boolean) get(3);
    }

    /**
     * Setter for <code>ehr.status.party</code>.
     */
    public void setParty(UUID value) {
        set(4, value);
    }

    /**
     * Getter for <code>ehr.status.party</code>.
     */
    public UUID getParty() {
        return (UUID) get(4);
    }

    /**
     * Setter for <code>ehr.status.other_details</code>.
     */
    public void setOtherDetails(ItemStructure value) {
        set(5, value);
    }

    /**
     * Getter for <code>ehr.status.other_details</code>.
     */
    public ItemStructure getOtherDetails() {
        return (ItemStructure) get(5);
    }

    /**
     * Setter for <code>ehr.status.sys_transaction</code>.
     */
    public void setSysTransaction(Timestamp value) {
        set(6, value);
    }

    /**
     * Getter for <code>ehr.status.sys_transaction</code>.
     */
    public Timestamp getSysTransaction() {
        return (Timestamp) get(6);
    }

    /**
     * Setter for <code>ehr.status.sys_period</code>.
     */
    public void setSysPeriod(SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value) {
        set(7, value);
    }

    /**
     * Getter for <code>ehr.status.sys_period</code>.
     */
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> getSysPeriod() {
        return (SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>) get(7);
    }

    /**
     * Setter for <code>ehr.status.has_audit</code>.
     */
    public void setHasAudit(UUID value) {
        set(8, value);
    }

    /**
     * Getter for <code>ehr.status.has_audit</code>.
     */
    public UUID getHasAudit() {
        return (UUID) get(8);
    }

    /**
     * Setter for <code>ehr.status.attestation_ref</code>.
     */
    public void setAttestationRef(UUID value) {
        set(9, value);
    }

    /**
     * Getter for <code>ehr.status.attestation_ref</code>.
     */
    public UUID getAttestationRef() {
        return (UUID) get(9);
    }

    /**
     * Setter for <code>ehr.status.in_contribution</code>.
     */
    public void setInContribution(UUID value) {
        set(10, value);
    }

    /**
     * Getter for <code>ehr.status.in_contribution</code>.
     */
    public UUID getInContribution() {
        return (UUID) get(10);
    }

    /**
     * Setter for <code>ehr.status.archetype_node_id</code>.
     */
    public void setArchetypeNodeId(String value) {
        set(11, value);
    }

    /**
     * Getter for <code>ehr.status.archetype_node_id</code>.
     */
    public String getArchetypeNodeId() {
        return (String) get(11);
    }

    /**
     * Setter for <code>ehr.status.name</code>.
     */
    public void setName(DvCodedTextRecord value) {
        set(12, value);
    }

    /**
     * Getter for <code>ehr.status.name</code>.
     */
    public DvCodedTextRecord getName() {
        return (DvCodedTextRecord) get(12);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<UUID> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record13 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row13<
                    UUID,
                    UUID,
                    Boolean,
                    Boolean,
                    UUID,
                    ItemStructure,
                    Timestamp,
                    SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>,
                    UUID,
                    UUID,
                    UUID,
                    String,
            DvCodedTextRecord>
            fieldsRow() {
        return (Row13) super.fieldsRow();
    }

    @Override
    public Row13<
                    UUID,
                    UUID,
                    Boolean,
                    Boolean,
                    UUID,
                    ItemStructure,
                    Timestamp,
                    SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>,
                    UUID,
                    UUID,
                    UUID,
                    String,
            DvCodedTextRecord>
            valuesRow() {
        return (Row13) super.valuesRow();
    }

    @Override
    public Field<UUID> field1() {
        return Status.STATUS.ID;
    }

    @Override
    public Field<UUID> field2() {
        return Status.STATUS.EHR_ID;
    }

    @Override
    public Field<Boolean> field3() {
        return Status.STATUS.IS_QUERYABLE;
    }

    @Override
    public Field<Boolean> field4() {
        return Status.STATUS.IS_MODIFIABLE;
    }

    @Override
    public Field<UUID> field5() {
        return Status.STATUS.PARTY;
    }

    @Override
    public Field<ItemStructure> field6() {
        return Status.STATUS.OTHER_DETAILS;
    }

    @Override
    public Field<Timestamp> field7() {
        return Status.STATUS.SYS_TRANSACTION;
    }

    @Override
    public Field<SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>> field8() {
        return Status.STATUS.SYS_PERIOD;
    }

    @Override
    public Field<UUID> field9() {
        return Status.STATUS.HAS_AUDIT;
    }

    @Override
    public Field<UUID> field10() {
        return Status.STATUS.ATTESTATION_REF;
    }

    @Override
    public Field<UUID> field11() {
        return Status.STATUS.IN_CONTRIBUTION;
    }

    @Override
    public Field<String> field12() {
        return Status.STATUS.ARCHETYPE_NODE_ID;
    }

    @Override
    public Field<DvCodedTextRecord> field13() {
        return Status.STATUS.NAME;
    }

    @Override
    public UUID component1() {
        return getId();
    }

    @Override
    public UUID component2() {
        return getEhrId();
    }

    @Override
    public Boolean component3() {
        return getIsQueryable();
    }

    @Override
    public Boolean component4() {
        return getIsModifiable();
    }

    @Override
    public UUID component5() {
        return getParty();
    }

    @Override
    public ItemStructure component6() {
        return getOtherDetails();
    }

    @Override
    public Timestamp component7() {
        return getSysTransaction();
    }

    @Override
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> component8() {
        return getSysPeriod();
    }

    @Override
    public UUID component9() {
        return getHasAudit();
    }

    @Override
    public UUID component10() {
        return getAttestationRef();
    }

    @Override
    public UUID component11() {
        return getInContribution();
    }

    @Override
    public String component12() {
        return getArchetypeNodeId();
    }

    @Override
    public DvCodedTextRecord component13() {
        return getName();
    }

    @Override
    public UUID value1() {
        return getId();
    }

    @Override
    public UUID value2() {
        return getEhrId();
    }

    @Override
    public Boolean value3() {
        return getIsQueryable();
    }

    @Override
    public Boolean value4() {
        return getIsModifiable();
    }

    @Override
    public UUID value5() {
        return getParty();
    }

    @Override
    public ItemStructure value6() {
        return getOtherDetails();
    }

    @Override
    public Timestamp value7() {
        return getSysTransaction();
    }

    @Override
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value8() {
        return getSysPeriod();
    }

    @Override
    public UUID value9() {
        return getHasAudit();
    }

    @Override
    public UUID value10() {
        return getAttestationRef();
    }

    @Override
    public UUID value11() {
        return getInContribution();
    }

    @Override
    public String value12() {
        return getArchetypeNodeId();
    }

    @Override
    public DvCodedTextRecord value13() {
        return getName();
    }

    @Override
    public StatusRecord value1(UUID value) {
        setId(value);
        return this;
    }

    @Override
    public StatusRecord value2(UUID value) {
        setEhrId(value);
        return this;
    }

    @Override
    public StatusRecord value3(Boolean value) {
        setIsQueryable(value);
        return this;
    }

    @Override
    public StatusRecord value4(Boolean value) {
        setIsModifiable(value);
        return this;
    }

    @Override
    public StatusRecord value5(UUID value) {
        setParty(value);
        return this;
    }

    @Override
    public StatusRecord value6(ItemStructure value) {
        setOtherDetails(value);
        return this;
    }

    @Override
    public StatusRecord value7(Timestamp value) {
        setSysTransaction(value);
        return this;
    }

    @Override
    public StatusRecord value8(SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value) {
        setSysPeriod(value);
        return this;
    }

    @Override
    public StatusRecord value9(UUID value) {
        setHasAudit(value);
        return this;
    }

    @Override
    public StatusRecord value10(UUID value) {
        setAttestationRef(value);
        return this;
    }

    @Override
    public StatusRecord value11(UUID value) {
        setInContribution(value);
        return this;
    }

    @Override
    public StatusRecord value12(String value) {
        setArchetypeNodeId(value);
        return this;
    }

    @Override
    public StatusRecord value13(DvCodedTextRecord value) {
        setName(value);
        return this;
    }

    @Override
    public StatusRecord values(
            UUID value1,
            UUID value2,
            Boolean value3,
            Boolean value4,
            UUID value5,
            ItemStructure value6,
            Timestamp value7,
            SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value8,
            UUID value9,
            UUID value10,
            UUID value11,
            String value12,
            DvCodedTextRecord value13) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        value7(value7);
        value8(value8);
        value9(value9);
        value10(value10);
        value11(value11);
        value12(value12);
        value13(value13);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached StatusRecord
     */
    public StatusRecord() {
        super(Status.STATUS);
    }

    /**
     * Create a detached, initialised StatusRecord
     */
    public StatusRecord(
            UUID id,
            UUID ehrId,
            Boolean isQueryable,
            Boolean isModifiable,
            UUID party,
            ItemStructure otherDetails,
            Timestamp sysTransaction,
            SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> sysPeriod,
            UUID hasAudit,
            UUID attestationRef,
            UUID inContribution,
            String archetypeNodeId,
            DvCodedTextRecord name) {
        super(Status.STATUS);

        setId(id);
        setEhrId(ehrId);
        setIsQueryable(isQueryable);
        setIsModifiable(isModifiable);
        setParty(party);
        setOtherDetails(otherDetails);
        setSysTransaction(sysTransaction);
        setSysPeriod(sysPeriod);
        setHasAudit(hasAudit);
        setAttestationRef(attestationRef);
        setInContribution(inContribution);
        setArchetypeNodeId(archetypeNodeId);
        setName(name);
    }
}
