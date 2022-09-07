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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.PrimitiveIterator;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.LongStream;
import org.apache.commons.lang3.StringUtils;
import org.ehrbase.aql.dto.path.AqlPath;
import org.ehrbase.serialisation.matrixencoding.Encoder;

public class InMemoryEncoder implements Encoder {

    private static Set<String> REQUIRED_PATHS = Set.of(
            // UID
            "/uid/_type",
            "/uid/value",
            // Composer
            "/composer/_type",
            "/composer/external_ref/_type",
            "/composer/external_ref/namespace",
            "/composer/external_ref/type",
            "/composer/external_ref/id/_type",
            "/composer/external_ref/id/value",
            "/composer/external_ref/id/scheme",
            "/composer/name",
            // Facility
            "/context/health_care_facility/_type",
            "/context/health_care_facility/external_ref/_type",
            "/context/health_care_facility/external_ref/namespace",
            "/context/health_care_facility/external_ref/type",
            "/context/health_care_facility/external_ref/id/_type",
            "/context/health_care_facility/external_ref/id/value",
            "/context/health_care_facility/external_ref/id/scheme",
            "/context/health_care_facility/name");

    private final Map<String, Long> pathToCodeCache;
    private final Map<Long, String> codeToPathCache;
    private final PrimitiveIterator.OfLong sequence;

    public InMemoryEncoder(Map<String, Long> encodings) {
        this.pathToCodeCache = new HashMap<>(encodings);
        this.codeToPathCache =
                pathToCodeCache.entrySet().stream().collect(Collectors.toMap(Map.Entry::getValue, Map.Entry::getKey));
        this.sequence = LongStream.iterate(
                        codeToPathCache.keySet().stream()
                                .max(Long::compareTo)
                                .map(l -> l + 1)
                                .orElse(0L),
                        l -> l + 1)
                .iterator();
        // We initialize the paths we will need for setting facility/composer data
        REQUIRED_PATHS.stream().filter(p -> !pathToCodeCache.containsKey(p)).forEach(p -> {
            Long code = sequence.next();
            pathToCodeCache.put(p, code);
            codeToPathCache.put(code, p);
        });
    }

    @Override
    public AqlPath encode(AqlPath path) {
        String format = path.format(AqlPath.OtherPredicatesFormat.SHORTED, true);
        Long code = pathToCodeCache.computeIfAbsent(format, k -> sequence.next());
        codeToPathCache.putIfAbsent(code, format);
        return AqlPath.parse(code.toString());
    }

    @Override
    public AqlPath decode(AqlPath path) {
        String format = StringUtils.removeStart(path.format(AqlPath.OtherPredicatesFormat.SHORTED, true), "/");
        return Optional.of(Long.parseLong(format))
                .map(codeToPathCache::get)
                .map(AqlPath::parse)
                .orElseThrow();
    }

    public Map<Long, String> getCodeToPathMap() {
        return new HashMap<>(codeToPathCache);
    }

    public Map<String, Long> getPathToCodeMap() {
        return new HashMap<>(pathToCodeCache);
    }
}
