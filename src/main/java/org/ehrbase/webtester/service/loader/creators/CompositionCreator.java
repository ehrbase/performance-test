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

import static org.ehrbase.webtester.service.loader.RandomHelper.getRandomGaussianWithLimitsLong;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.ehrbase.jooq.pg.enums.ContributionDataType;
import org.ehrbase.webtester.service.loader.RandomHelper;
import org.jooq.DSLContext;

class CompositionCreator extends AbstractDataCreator<CompositionCreateDescriptor, CompositionCreationInfo> {

    private final LegacyCompositionCreator legacyCompositionCreator;
    private final MatrixCompositionCreator matrixCompositionCreator;

    CompositionCreator(
            DSLContext dsl, String zoneId, UUID systemId, UUID committerId, Map<String, Integer> territories) {
        super(dsl, zoneId, systemId, committerId, territories);
        this.legacyCompositionCreator = new LegacyCompositionCreator(dsl, zoneId, systemId, committerId, territories);
        this.matrixCompositionCreator = new MatrixCompositionCreator(dsl, zoneId, systemId, committerId, territories);
    }

    @Override
    public CompositionCreateDescriptor create(CompositionCreationInfo info) {

        int hcpCount = (int) getRandomGaussianWithLimitsLong(0, 1, 1, 3);
        Pair<UUID, String> composerId = info.getAvailableHcpIds()
                .get(info.getCompositionCounter() % info.getAvailableHcpIds().size());
        OffsetDateTime sysTransaction = OffsetDateTime.now();
        List<Pair<UUID, String>> participants = new ArrayList<>();
        if (hcpCount > 1 && info.getAvailableHcpIds().size() > 1) {
            List<Pair<UUID, String>> participationCandidates =
                    CollectionUtils.selectRejected(info.getAvailableHcpIds(), composerId::equals, new ArrayList<>());
            IntStream.range(0, hcpCount - 1)
                    .mapToObj(i ->
                            participationCandidates.get(RandomHelper.RND.get().nextInt(participationCandidates.size())))
                    .forEach(participants::add);
        }

        CompositionCreateDescriptor createDescriptor = new CompositionCreateDescriptor();
        createDescriptor.setCompositionAudit(createAuditDetails("Create COMPOSITION", sysTransaction));
        createDescriptor.setContribution(createContribution(
                info.getEhrId(), createDescriptor.getCompositionAudit().getId(), ContributionDataType.composition));
        UUID compositionId = UUID.randomUUID();

        if (info.getModes().contains(CompositionCreationInfo.CompositionDataMode.LEGACY)) {
            LegacyCompositionCreator.LegacyCompositionData legacyCompositionData =
                    legacyCompositionCreator.create(new LegacyCompositionCreator.LegacyCompositionCreationInfo(
                            info.getEhrId(),
                            composerId.getKey(),
                            compositionId,
                            createDescriptor.getContribution().getId(),
                            createDescriptor.getCompositionAudit().getId(),
                            info.getFacility().getKey(),
                            participants.stream().map(Pair::getKey).collect(Collectors.toList()),
                            info.getSelectedComposition(),
                            sysTransaction));
            createDescriptor.setComposition(legacyCompositionData.getComposition());
            createDescriptor.setEntry(legacyCompositionData.getEntry());
            createDescriptor.setEventContext(legacyCompositionData.getEventContext());
            createDescriptor.setParticipations(legacyCompositionData.getParticipations());
        }

        if (info.getModes().contains(CompositionCreationInfo.CompositionDataMode.LEGACY)) {
            MatrixCompositionCreator.MatrixCompositionData matrixCompositionData =
                    matrixCompositionCreator.create(new MatrixCompositionCreator.MatrixCompositionCreationInfo(
                            info.getEhrId(),
                            composerId,
                            compositionId,
                            info.getFacility(),
                            info.getSelectedComposition()));
            createDescriptor.setMatrixRecords(matrixCompositionData.getMatrixRecords());
        }

        return createDescriptor;
    }
}
