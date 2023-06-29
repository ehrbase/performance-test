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
import org.ehrbase.jooq.pg.tables.AdminDeleteFolder;
import org.jooq.Field;
import org.jooq.Record3;
import org.jooq.Row3;
import org.jooq.impl.TableRecordImpl;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({"all", "unchecked", "rawtypes"})
public class AdminDeleteFolderRecord extends TableRecordImpl<AdminDeleteFolderRecord>
        implements Record3<UUID, UUID, UUID> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>ehr.admin_delete_folder.contribution</code>.
     */
    public void setContribution(UUID value) {
        set(0, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_folder.contribution</code>.
     */
    public UUID getContribution() {
        return (UUID) get(0);
    }

    /**
     * Setter for <code>ehr.admin_delete_folder.child</code>.
     */
    public void setChild(UUID value) {
        set(1, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_folder.child</code>.
     */
    public UUID getChild() {
        return (UUID) get(1);
    }

    /**
     * Setter for <code>ehr.admin_delete_folder.audit</code>.
     */
    public void setAudit(UUID value) {
        set(2, value);
    }

    /**
     * Getter for <code>ehr.admin_delete_folder.audit</code>.
     */
    public UUID getAudit() {
        return (UUID) get(2);
    }

    // -------------------------------------------------------------------------
    // Record3 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row3<UUID, UUID, UUID> fieldsRow() {
        return (Row3) super.fieldsRow();
    }

    @Override
    public Row3<UUID, UUID, UUID> valuesRow() {
        return (Row3) super.valuesRow();
    }

    @Override
    public Field<UUID> field1() {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.CONTRIBUTION;
    }

    @Override
    public Field<UUID> field2() {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.CHILD;
    }

    @Override
    public Field<UUID> field3() {
        return AdminDeleteFolder.ADMIN_DELETE_FOLDER.AUDIT;
    }

    @Override
    public UUID component1() {
        return getContribution();
    }

    @Override
    public UUID component2() {
        return getChild();
    }

    @Override
    public UUID component3() {
        return getAudit();
    }

    @Override
    public UUID value1() {
        return getContribution();
    }

    @Override
    public UUID value2() {
        return getChild();
    }

    @Override
    public UUID value3() {
        return getAudit();
    }

    @Override
    public AdminDeleteFolderRecord value1(UUID value) {
        setContribution(value);
        return this;
    }

    @Override
    public AdminDeleteFolderRecord value2(UUID value) {
        setChild(value);
        return this;
    }

    @Override
    public AdminDeleteFolderRecord value3(UUID value) {
        setAudit(value);
        return this;
    }

    @Override
    public AdminDeleteFolderRecord values(UUID value1, UUID value2, UUID value3) {
        value1(value1);
        value2(value2);
        value3(value3);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached AdminDeleteFolderRecord
     */
    public AdminDeleteFolderRecord() {
        super(AdminDeleteFolder.ADMIN_DELETE_FOLDER);
    }

    /**
     * Create a detached, initialised AdminDeleteFolderRecord
     */
    public AdminDeleteFolderRecord(UUID contribution, UUID child, UUID audit) {
        super(AdminDeleteFolder.ADMIN_DELETE_FOLDER);

        setContribution(contribution);
        setChild(child);
        setAudit(audit);
    }
}