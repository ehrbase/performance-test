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

import java.sql.Timestamp;
import java.util.AbstractMap.SimpleEntry;
import java.util.UUID;
import org.ehrbase.jooq.pg.tables.EventContext;
import org.ehrbase.jooq.pg.udt.records.DvCodedTextRecord;
import org.jooq.Field;
import org.jooq.JSONB;
import org.jooq.Record1;
import org.jooq.Record12;
import org.jooq.Row12;
import org.jooq.impl.UpdatableRecordImpl;

/**
 * defines the context of an event (time, who, where... see openEHR IM 5.2
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class EventContextRecord extends UpdatableRecordImpl<EventContextRecord>
        implements Record12<
                UUID,
                UUID,
                Timestamp,
                String,
                Timestamp,
                String,
                UUID,
                String,
                JSONB,
        DvCodedTextRecord,
                Timestamp,
                SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.event_context.id</code>.
     */
    public void setId(UUID value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.event_context.id</code>.
     */
    public UUID getId() {
        return (UUID) get(0);
    }

    /**
     * Setter for <code>ehr.event_context.composition_id</code>.
     */
    public void setCompositionId(UUID value) {
        set(1, value);
    }

    /**
     * Getter for <code>ehr.event_context.composition_id</code>.
     */
    public UUID getCompositionId() {
        return (UUID) get(1);
    }

    /**
     * Setter for <code>ehr.event_context.start_time</code>.
     */
    public void setStartTime(Timestamp value) {
        set(2, value);
    }

    /**
     * Getter for <code>ehr.event_context.start_time</code>.
     */
    public Timestamp getStartTime() {
        return (Timestamp) get(2);
    }

    /**
     * Setter for <code>ehr.event_context.start_time_tzid</code>.
     */
    public void setStartTimeTzid(String value) {
        set(3, value);
    }

    /**
     * Getter for <code>ehr.event_context.start_time_tzid</code>.
     */
    public String getStartTimeTzid() {
        return (String) get(3);
    }

    /**
     * Setter for <code>ehr.event_context.end_time</code>.
     */
    public void setEndTime(Timestamp value) {
        set(4, value);
    }

    /**
     * Getter for <code>ehr.event_context.end_time</code>.
     */
    public Timestamp getEndTime() {
        return (Timestamp) get(4);
    }

    /**
     * Setter for <code>ehr.event_context.end_time_tzid</code>.
     */
    public void setEndTimeTzid(String value) {
        set(5, value);
    }

    /**
     * Getter for <code>ehr.event_context.end_time_tzid</code>.
     */
    public String getEndTimeTzid() {
        return (String) get(5);
    }

    /**
     * Setter for <code>ehr.event_context.facility</code>.
     */
    public void setFacility(UUID value) {
        set(6, value);
    }

    /**
     * Getter for <code>ehr.event_context.facility</code>.
     */
    public UUID getFacility() {
        return (UUID) get(6);
    }

    /**
     * Setter for <code>ehr.event_context.location</code>.
     */
    public void setLocation(String value) {
        set(7, value);
    }

    /**
     * Getter for <code>ehr.event_context.location</code>.
     */
    public String getLocation() {
        return (String) get(7);
    }

    /**
     * Setter for <code>ehr.event_context.other_context</code>.
     */
    public void setOtherContext(JSONB value) {
        set(8, value);
    }

    /**
     * Getter for <code>ehr.event_context.other_context</code>.
     */
    public JSONB getOtherContext() {
        return (JSONB) get(8);
    }

    /**
     * Setter for <code>ehr.event_context.setting</code>.
     */
    public void setSetting(DvCodedTextRecord value) {
        set(9, value);
    }

    /**
     * Getter for <code>ehr.event_context.setting</code>.
     */
    public DvCodedTextRecord getSetting() {
        return (DvCodedTextRecord) get(9);
    }

    /**
     * Setter for <code>ehr.event_context.sys_transaction</code>.
     */
    public void setSysTransaction(Timestamp value) {
        set(10, value);
    }

    /**
     * Getter for <code>ehr.event_context.sys_transaction</code>.
     */
    public Timestamp getSysTransaction() {
        return (Timestamp) get(10);
    }

    /**
     * Setter for <code>ehr.event_context.sys_period</code>.
     */
    public void setSysPeriod(SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value) {
        set(11, value);
    }

    /**
     * Getter for <code>ehr.event_context.sys_period</code>.
     */
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> getSysPeriod() {
        return (SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>) get(11);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<UUID> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record12 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row12<
                    UUID,
                    UUID,
                    Timestamp,
                    String,
                    Timestamp,
                    String,
                    UUID,
                    String,
                    JSONB,
            DvCodedTextRecord,
                    Timestamp,
                    SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>>
            fieldsRow() {
        return (Row12) super.fieldsRow();
    }

    @Override
    public Row12<
                    UUID,
                    UUID,
                    Timestamp,
                    String,
                    Timestamp,
                    String,
                    UUID,
                    String,
                    JSONB,
            DvCodedTextRecord,
                    Timestamp,
                    SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>>
            valuesRow() {
        return (Row12) super.valuesRow();
    }

    @Override
    public Field<UUID> field1() {
        return EventContext.EVENT_CONTEXT.ID;
    }

    @Override
    public Field<UUID> field2() {
        return EventContext.EVENT_CONTEXT.COMPOSITION_ID;
    }

    @Override
    public Field<Timestamp> field3() {
        return EventContext.EVENT_CONTEXT.START_TIME;
    }

    @Override
    public Field<String> field4() {
        return EventContext.EVENT_CONTEXT.START_TIME_TZID;
    }

    @Override
    public Field<Timestamp> field5() {
        return EventContext.EVENT_CONTEXT.END_TIME;
    }

    @Override
    public Field<String> field6() {
        return EventContext.EVENT_CONTEXT.END_TIME_TZID;
    }

    @Override
    public Field<UUID> field7() {
        return EventContext.EVENT_CONTEXT.FACILITY;
    }

    @Override
    public Field<String> field8() {
        return EventContext.EVENT_CONTEXT.LOCATION;
    }

    @Override
    public Field<JSONB> field9() {
        return EventContext.EVENT_CONTEXT.OTHER_CONTEXT;
    }

    @Override
    public Field<DvCodedTextRecord> field10() {
        return EventContext.EVENT_CONTEXT.SETTING;
    }

    @Override
    public Field<Timestamp> field11() {
        return EventContext.EVENT_CONTEXT.SYS_TRANSACTION;
    }

    @Override
    public Field<SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime>> field12() {
        return EventContext.EVENT_CONTEXT.SYS_PERIOD;
    }

    @Override
    public UUID component1() {
        return getId();
    }

    @Override
    public UUID component2() {
        return getCompositionId();
    }

    @Override
    public Timestamp component3() {
        return getStartTime();
    }

    @Override
    public String component4() {
        return getStartTimeTzid();
    }

    @Override
    public Timestamp component5() {
        return getEndTime();
    }

    @Override
    public String component6() {
        return getEndTimeTzid();
    }

    @Override
    public UUID component7() {
        return getFacility();
    }

    @Override
    public String component8() {
        return getLocation();
    }

    @Override
    public JSONB component9() {
        return getOtherContext();
    }

    @Override
    public DvCodedTextRecord component10() {
        return getSetting();
    }

    @Override
    public Timestamp component11() {
        return getSysTransaction();
    }

    @Override
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> component12() {
        return getSysPeriod();
    }

    @Override
    public UUID value1() {
        return getId();
    }

    @Override
    public UUID value2() {
        return getCompositionId();
    }

    @Override
    public Timestamp value3() {
        return getStartTime();
    }

    @Override
    public String value4() {
        return getStartTimeTzid();
    }

    @Override
    public Timestamp value5() {
        return getEndTime();
    }

    @Override
    public String value6() {
        return getEndTimeTzid();
    }

    @Override
    public UUID value7() {
        return getFacility();
    }

    @Override
    public String value8() {
        return getLocation();
    }

    @Override
    public JSONB value9() {
        return getOtherContext();
    }

    @Override
    public DvCodedTextRecord value10() {
        return getSetting();
    }

    @Override
    public Timestamp value11() {
        return getSysTransaction();
    }

    @Override
    public SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value12() {
        return getSysPeriod();
    }

    @Override
    public EventContextRecord value1(UUID value) {
        setId(value);
        return this;
    }

    @Override
    public EventContextRecord value2(UUID value) {
        setCompositionId(value);
        return this;
    }

    @Override
    public EventContextRecord value3(Timestamp value) {
        setStartTime(value);
        return this;
    }

    @Override
    public EventContextRecord value4(String value) {
        setStartTimeTzid(value);
        return this;
    }

    @Override
    public EventContextRecord value5(Timestamp value) {
        setEndTime(value);
        return this;
    }

    @Override
    public EventContextRecord value6(String value) {
        setEndTimeTzid(value);
        return this;
    }

    @Override
    public EventContextRecord value7(UUID value) {
        setFacility(value);
        return this;
    }

    @Override
    public EventContextRecord value8(String value) {
        setLocation(value);
        return this;
    }

    @Override
    public EventContextRecord value9(JSONB value) {
        setOtherContext(value);
        return this;
    }

    @Override
    public EventContextRecord value10(DvCodedTextRecord value) {
        setSetting(value);
        return this;
    }

    @Override
    public EventContextRecord value11(Timestamp value) {
        setSysTransaction(value);
        return this;
    }

    @Override
    public EventContextRecord value12(SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value) {
        setSysPeriod(value);
        return this;
    }

    @Override
    public EventContextRecord values(
            UUID value1,
            UUID value2,
            Timestamp value3,
            String value4,
            Timestamp value5,
            String value6,
            UUID value7,
            String value8,
            JSONB value9,
            DvCodedTextRecord value10,
            Timestamp value11,
            SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> value12) {
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
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached EventContextRecord
     */
    public EventContextRecord() {
        super(EventContext.EVENT_CONTEXT);
    }

    /**
     * Create a detached, initialised EventContextRecord
     */
    public EventContextRecord(
            UUID id,
            UUID compositionId,
            Timestamp startTime,
            String startTimeTzid,
            Timestamp endTime,
            String endTimeTzid,
            UUID facility,
            String location,
            JSONB otherContext,
            DvCodedTextRecord setting,
            Timestamp sysTransaction,
            SimpleEntry<java.time.OffsetDateTime, java.time.OffsetDateTime> sysPeriod) {
        super(EventContext.EVENT_CONTEXT);

        setId(id);
        setCompositionId(compositionId);
        setStartTime(startTime);
        setStartTimeTzid(startTimeTzid);
        setEndTime(endTime);
        setEndTimeTzid(endTimeTzid);
        setFacility(facility);
        setLocation(location);
        setOtherContext(otherContext);
        setSetting(setting);
        setSysTransaction(sysTransaction);
        setSysPeriod(sysPeriod);
    }
}
