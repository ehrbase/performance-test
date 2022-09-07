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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.UncheckedIOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PrimitiveIterator;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.commons.lang3.tuple.Pair;
import org.ehrbase.aql.dto.path.AqlPath;
import org.ehrbase.serialisation.matrixencoding.Row;
import org.ehrbase.webtester.service.loader.CachedComposition;
import org.ehrbase.webtester.service.loader.jooq.Entry2;
import org.ehrbase.webtester.service.loader.jooq.Entry2Record;
import org.jooq.DSLContext;
import org.jooq.JSONB;

public class MatrixCompositionCreator
        extends AbstractDataCreator<
                MatrixCompositionCreator.MatrixCompositionData,
                MatrixCompositionCreator.MatrixCompositionCreationInfo> {

    private final ObjectMapper om = new ObjectMapper();
    private final Map<String, String> pathToEncodedPathMap;

    public static class MatrixCompositionData {
        private List<Entry2Record> matrixRecords;

        public List<Entry2Record> getMatrixRecords() {
            return matrixRecords;
        }

        public void setMatrixRecords(List<Entry2Record> matrixRecords) {
            this.matrixRecords = matrixRecords;
        }
    }

    public static class MatrixCompositionCreationInfo {
        private final Pair<UUID, String> composerId;
        private final UUID compositionId;
        private final UUID ehrId;
        private final Pair<UUID, String> facility;
        private final CachedComposition selectedComposition;

        public MatrixCompositionCreationInfo(
                UUID ehrId,
                Pair<UUID, String> composerId,
                UUID compositionId,
                Pair<UUID, String> facility,
                CachedComposition selectedComposition) {
            this.composerId = composerId;
            this.compositionId = compositionId;
            this.ehrId = ehrId;
            this.facility = facility;
            this.selectedComposition = selectedComposition;
        }

        public UUID getCompositionId() {
            return compositionId;
        }

        public Pair<UUID, String> getComposerId() {
            return composerId;
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
    }

    protected MatrixCompositionCreator(
            DSLContext dsl,
            String zoneId,
            UUID systemId,
            UUID committerId,
            Map<String, Integer> territories,
            Map<String, String> pathToEncodedPathMap) {
        super(dsl, zoneId, systemId, committerId, territories);
        this.pathToEncodedPathMap = pathToEncodedPathMap;
    }

    public MatrixCompositionData create(MatrixCompositionCreationInfo info) {
        MatrixCompositionData createDescriptor = new MatrixCompositionData();

        List<Entry2Record> records = info.getSelectedComposition().getMatrixFormatData().stream()
                .map(d -> buildMatrixRecord(
                        info.getComposerId(),
                        info.getCompositionId(),
                        info.getEhrId(),
                        info.getFacility(),
                        d.getLeft(),
                        new HashMap<>(d.getRight())))
                .collect(Collectors.toList());
        final PrimitiveIterator.OfInt numIterator =
                IntStream.iterate(0, i -> i + 1).iterator();
        records.forEach(r -> r.setNum(numIterator.nextInt()));

        return createDescriptor;
    }

    private Entry2Record buildMatrixRecord(
            Pair<UUID, String> composerId,
            UUID compositionId,
            UUID ehrId,
            Pair<UUID, String> facility,
            Row row,
            Map<String, String> data) {
        Entry2Record entry2Record = getDsl().newRecord(Entry2.ENTRY2);
        entry2Record.setCompId(compositionId);
        entry2Record.setEhrId(ehrId);
        entry2Record.setEntityConcept(row.getArchetypeId());
        entry2Record.setRmEntity(row.getRmType());
        entry2Record.setEntityPath(row.getEntityPath().format(AqlPath.OtherPredicatesFormat.SHORTED, true));
        entry2Record.setEntityIdx(row.getEntityIdx());
        entry2Record.setFieldIdx(row.getFieldIdx());
        entry2Record.setFieldIdxLen(row.getFieldIdx().length);
        entry2Record.setTemplateId(row.getTemplateId());

        try {
            if (row.getNum() == 0 && data != null) {
                // UID
                data.put(pathToEncodedPathMap.get("/uid/_type"), "PARTY_IDENTIFIED");
                data.put(
                        pathToEncodedPathMap.get("/uid/value"),
                        compositionId.toString() + "::" + getSystemSetting() + "::1");

                // Composer
                data.put(pathToEncodedPathMap.get("/composer/_type"), "PARTY_IDENTIFIED");
                data.put(pathToEncodedPathMap.get("/composer/external_ref/_type"), "PARTY_REF");
                data.put(pathToEncodedPathMap.get("/composer/external_ref/namespace"), "hcp");
                data.put(pathToEncodedPathMap.get("/composer/external_ref/type"), "PERSON");
                data.put(pathToEncodedPathMap.get("/composer/external_ref/id/_type"), "GENERIC_ID");
                data.put(
                        pathToEncodedPathMap.get("/composer/external_ref/id/value"),
                        composerId.getKey().toString());
                data.put(pathToEncodedPathMap.get("/composer/external_ref/id/scheme"), "id_scheme");
                data.put(pathToEncodedPathMap.get("/composer/name"), composerId.getValue());

                // Facility
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/_type"), "PARTY_IDENTIFIED");
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/external_ref/_type"), "PARTY_REF");
                data.put(
                        pathToEncodedPathMap.get("/context/health_care_facility/external_ref/namespace"), "facilities");
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/external_ref/type"), "ORGANISATION");
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/external_ref/id/_type"), "GENERIC_ID");
                data.put(
                        pathToEncodedPathMap.get("/context/health_care_facility/external_ref/id/value"),
                        facility.getKey().toString());
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/external_ref/id/scheme"), "id_scheme");
                data.put(pathToEncodedPathMap.get("/context/health_care_facility/name"), facility.getValue());

                entry2Record.setFields(JSONB.jsonb(om.writeValueAsString(data)));
            } else if (data != null && !data.isEmpty()) {
                entry2Record.setFields(JSONB.jsonb(om.writeValueAsString(data)));
            } else {
                // This might not be needed, but is here for better readability
                entry2Record.setFields(null);
            }
        } catch (JsonProcessingException e) {
            throw new UncheckedIOException(e);
        }

        return entry2Record;
    }
}
