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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.UncheckedIOException;
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

    private ObjectMapper om = new ObjectMapper();

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
            DSLContext dsl, String zoneId, UUID systemId, UUID committerId, Map<String, Integer> territories) {
        super(dsl, zoneId, systemId, committerId, territories);
    }

    public MatrixCompositionData create(MatrixCompositionCreationInfo info) {
        MatrixCompositionData createDescriptor = new MatrixCompositionData();

        // TODO
        List<Entry2Record> records = info.getSelectedComposition().getMatrixFormatData().stream()
                .map(d -> buildMatrixRecord(
                        info.getComposerId(), info.getCompositionId(), info.getEhrId(), info.getFacility(), d))
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
            Pair<Row, String> rowWithData) {
        Entry2Record entry2Record = getDsl().newRecord(Entry2.ENTRY2);
        entry2Record.setCompId(compositionId);
        entry2Record.setEhrId(ehrId);
        entry2Record.setEntityConcept(rowWithData.getLeft().getArchetypeId());
        entry2Record.setRmEntity(rowWithData.getLeft().getRmType());
        entry2Record.setEntityPath(
                rowWithData.getLeft().getEntityPath().format(AqlPath.OtherPredicatesFormat.SHORTED, true));
        entry2Record.setEntityIdx(rowWithData.getLeft().getEntityIdx());
        entry2Record.setFieldIdx(rowWithData.getLeft().getFieldIdx());
        entry2Record.setFieldIdxLen(rowWithData.getLeft().getFieldIdx().length);

        if (rowWithData.getLeft().getNum() == 0 && rowWithData.getRight() != null) {
            try {
                Map<String, String> kvMap = om.readValue(rowWithData.getRight(), new TypeReference<>() {});
                // Composer data
                kvMap.put("/composer/_type", "PARTY_IDENTIFIED");
                kvMap.put("/composer/external_ref/_type", "PARTY_REF");
                kvMap.put("/composer/external_ref/namespace", "hcp");
                kvMap.put("/composer/external_ref/type", "PERSON");
                kvMap.put("/composer/external_ref/id/_type", "GENERIC_ID");
                kvMap.put("/composer/external_ref/id/value", composerId.getKey().toString());
                kvMap.put("/composer/external_ref/id/scheme", "id_scheme");
                kvMap.put("/composer/name", composerId.getValue());
                // Facility
                kvMap.put("/context/health_care_facility/_type", "PARTY_IDENTIFIED");
                kvMap.put("/context/health_care_facility/external_ref/_type", "PARTY_REF");
                kvMap.put("/context/health_care_facility/external_ref/namespace", "facilities");
                kvMap.put("/context/health_care_facility/external_ref/type", "ORGANISATION");
                kvMap.put("/context/health_care_facility/external_ref/id/_type", "GENERIC_ID");
                kvMap.put(
                        "/context/health_care_facility/external_ref/id/value",
                        facility.getKey().toString());
                kvMap.put("/context/health_care_facility/external_ref/id/scheme", "id_scheme");
                kvMap.put("/context/health_care_facility/name", facility.getValue());

                entry2Record.setFields(JSONB.jsonb(om.writeValueAsString(kvMap)));
            } catch (JsonProcessingException e) {
                throw new UncheckedIOException(e);
            }
        } else {
            entry2Record.setFields(JSONB.jsonbOrNull(rowWithData.getRight()));
        }

        return entry2Record;
    }
}
