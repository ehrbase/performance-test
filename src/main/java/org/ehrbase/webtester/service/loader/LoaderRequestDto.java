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

import java.util.EnumSet;
import java.util.Set;
import org.apache.commons.collections4.CollectionUtils;
import org.ehrbase.webtester.service.loader.creators.CompositionDataMode;

/**
 * Parameters for starting or continuing a loader job
 */
public class LoaderRequestDto {

    private int ehr = 100;
    private int healthcareFacilities = 5;
    private int bulkSize = 200;
    private int ehrsPerBatch = 10;
    private Set<CompositionDataMode> modes;
    private boolean recreateIndexesNonConcurrently = true;

    public Set<CompositionDataMode> getModes() {
        if (CollectionUtils.isEmpty(modes)) {
            // No mode defaults to all modes
            this.modes = EnumSet.allOf(CompositionDataMode.class);
        }
        return modes;
    }

    public void setModes(Set<CompositionDataMode> modes) {
        this.modes = modes;
    }

    public Integer getEhr() {
        return ehr;
    }

    public void setEhr(Integer ehr) {
        this.ehr = ehr;
    }

    public int getHealthcareFacilities() {
        return healthcareFacilities;
    }

    public void setHealthcareFacilities(int healthcareFacilities) {
        this.healthcareFacilities = healthcareFacilities;
    }

    public int getBulkSize() {
        return bulkSize;
    }

    public void setBulkSize(int bulkSize) {
        this.bulkSize = bulkSize;
    }

    public int getEhrsPerBatch() {
        return ehrsPerBatch;
    }

    public void setEhrsPerBatch(int ehrsPerBatch) {
        this.ehrsPerBatch = ehrsPerBatch;
    }

    public boolean isRecreateIndexesNonConcurrently() {
        return recreateIndexesNonConcurrently;
    }

    public void setRecreateIndexesNonConcurrently(boolean recreateIndexesNonConcurrently) {
        this.recreateIndexesNonConcurrently = recreateIndexesNonConcurrently;
    }
}
