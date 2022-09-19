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

import com.nedap.archie.rm.composition.Composition;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.tuple.Pair;
import org.ehrbase.serialisation.matrixencoding.Row;

public class CachedComposition {
    private final int idx;
    private final Composition composition;
    private final String entryJsonb;
    private final List<Pair<Row, Map<String, Object>>> matrixFormatData;

    public CachedComposition(
            int idx,
            Composition composition,
            String entryJsonb,
            List<Pair<Row, Map<String, Object>>> matrixFormatData) {
        this.idx = idx;
        this.composition = composition;
        this.entryJsonb = entryJsonb;
        this.matrixFormatData =
                matrixFormatData == null ? Collections.emptyList() : Collections.unmodifiableList(matrixFormatData);
    }

    public int getIdx() {
        return idx;
    }

    public Composition getComposition() {
        return composition;
    }

    public String getEntryJsonb() {
        return entryJsonb;
    }

    public List<Pair<Row, Map<String, Object>>> getMatrixFormatData() {
        return matrixFormatData;
    }
}
