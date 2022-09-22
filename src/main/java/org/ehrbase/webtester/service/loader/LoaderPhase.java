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
package org.ehrbase.webtester.service.loader;

/**
 * represents a steps in the loading process
 */
public enum LoaderPhase {
    /**
     * Not yet run on this DB
     */
    NOT_RUN,
    /**
     * A previous run was completed on this DB
     */
    FINISHED,
    /**
     * prepare the DB schema and save restoration info
     */
    PRE_LOAD,
    /**
     * insert ehr batches excluding JSONB in ehr.entry.entry column
     */
    PHASE_1,
    /**
     * remove data from temporary ehr.entry_x tables and insert into target table with JSONB
     */
    PHASE_2,
    /**
     * restore DB schema to the intial state
     */
    POST_LOAD
}
