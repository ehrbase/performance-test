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
package org.ehrbase.webtester.service.loader.creators;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.ehrbase.webtester.service.loader.CachedComposition;
import org.ehrbase.webtester.service.loader.LoaderException;

/**
 * information necessary to create the records to insert for a composition
 */
public class CompositionCreationInfo {

    private final UUID ehrId;
    private final Pair<UUID, String> facility;
    private final List<Pair<UUID, String>> availableHcpIds;
    private final CachedComposition selectedComposition;
    private final Set<CompositionDataMode> modes;
    private final int compositionCounter;

    public CompositionCreationInfo(
            UUID ehrId,
            Pair<UUID, String> facility,
            List<Pair<UUID, String>> availableHcpIds,
            CachedComposition selectedComposition,
            Set<CompositionDataMode> modes,
            int compositionCounter) {
        this.ehrId = Objects.requireNonNull(ehrId);
        this.availableHcpIds = Objects.requireNonNull(availableHcpIds);
        this.facility = Objects.requireNonNull(facility);
        this.selectedComposition = Objects.requireNonNull(selectedComposition);
        this.compositionCounter = compositionCounter;
        if (CollectionUtils.isEmpty(modes)) {
            throw new LoaderException("No composition data mode selected");
        }
        this.modes = modes;
    }

    public UUID getEhrId() {
        return ehrId;
    }

    public Pair<UUID, String> getFacility() {
        return facility;
    }

    public CachedComposition getSelectedComposition() {
        return selectedComposition;
    }

    public Set<CompositionDataMode> getModes() {
        return modes;
    }

    public List<Pair<UUID, String>> getAvailableHcpIds() {
        return availableHcpIds;
    }

    public int getCompositionCounter() {
        return compositionCounter;
    }
}
