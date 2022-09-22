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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Use this service to read and update state information of the loader in the DB
 */
@Service
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "true")
// We do not use JOOQ here intentionally
public class LoaderStateService {

    private static final Set<Pair<String, String>> REQUIRED_KEYS = Set.of(
            Pair.of("execution_state", LoaderPhase.NOT_RUN.name()),
            Pair.of("indexes", "[]"),
            Pair.of("unique_constraints", "[]"),
            Pair.of("tmp_tables", "[]"),
            Pair.of("tables", "[]"),
            Pair.of("settings", "{}"),
            Pair.of("ehr_count", "0"));
    private final ObjectMapper om = new ObjectMapper();
    private final HikariDataSource dataSource;

    public LoaderStateService(@Qualifier("secondaryDataSource") HikariDataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void initialize() {
        try (Connection c = dataSource.getConnection();
                Statement s = c.createStatement()) {
            s.executeUpdate("CREATE TABLE IF NOT EXISTS ehr.loader_state(key TEXT, value TEXT, PRIMARY KEY (key));");
            Set<String> existingKeys = new HashSet<>();
            try (ResultSet rs = s.executeQuery("SELECT key FROM ehr.loader_state;")) {
                while (rs.next()) {
                    existingKeys.add(rs.getString(1));
                }
            }
            if (existingKeys.size() != REQUIRED_KEYS.size()) {
                String inserts = REQUIRED_KEYS.stream()
                        .filter(k -> !existingKeys.contains(k.getKey()))
                        .map(kv -> String.format("('%s','%s')", kv.getKey(), kv.getValue()))
                        .collect(Collectors.joining(",", "INSERT INTO ehr.loader_state VALUES ", ";"));
                s.executeUpdate(inserts);
            }
        } catch (SQLException e) {
            throw new LoaderException("Failed to create ehr.loader_state table:", e);
        }
    }

    /**
     * Update the loder phase in the DB
     * @param phase
     */
    public void updateCurrentLoaderPhase(LoaderPhase phase) {
        Objects.requireNonNull(phase);
        update("execution_state", phase.name());
    }

    /**
     * Retrieve the current loader phase from the DB
     * @return
     */
    public LoaderPhase getCurrentPhase() {
        return LoaderPhase.valueOf(load("execution_state"));
    }

    /**
     * Get information about all required indexes from the DB
     * @return
     */
    public List<IndexInfo> getIndexInfoFromDB() {
        return loadAndDeserializeList("indexes", IndexInfo.class);
    }

    /**
     * Update information about all required indexes in the DB
     * @return
     */
    public void updateIndexInfo(List<IndexInfo> indexInfo) {
        Objects.requireNonNull(indexInfo);
        serializeAndUpdate("indexes", indexInfo);
    }

    /**
     * Get information about all required unique constraints from the DB
     * @return
     */
    public List<Constraint> getUniqueConstraintsFromDB() {
        return loadAndDeserializeList("unique_constraints", Constraint.class);
    }

    /**
     * Update information about all required unique constrains in the DB
     * @return
     */
    public void updateUniqueConstraints(List<Constraint> constraints) {
        Objects.requireNonNull(constraints);
        serializeAndUpdate("unique_constraints", constraints);
    }

    /**
     * Get all relevant non-temporary table names from the DB
     * @return
     */
    public List<String> getTableNamesFromDB() {
        return loadAndDeserializeList("tables", String.class);
    }

    /**
     * Update list of relevant non-temporary table names in the DB
     * @return
     */
    public void updateTableNames(List<String> tableNames) {
        Objects.requireNonNull(tableNames);
        serializeAndUpdate("tables", tableNames);
    }

    /**
     * Get all relevant temporary table names from the DB
     * @return
     */
    public List<String> getTemporaryTableNamesFromDB() {
        return loadAndDeserializeList("tmp_tables", String.class);
    }

    /**
     * Update list of relevant temporary table names in the DB
     * @return
     */
    public void updateTemporaryTableNames(List<String> temporaryTableNames) {
        Objects.requireNonNull(temporaryTableNames);
        serializeAndUpdate("tmp_tables", temporaryTableNames);
    }

    /**
     * Get parameters for the latest loader job from the DB
     * @return
     */
    public LoaderRequestDto getSettingsFromDB() {
        return loadAndDeserialize("settings", LoaderRequestDto.class);
    }

    /**
     * Update parameters for the latest loader job in the DB
     * @return
     */
    public void updateLoaderSettings(LoaderRequestDto loaderSettings) {
        Objects.requireNonNull(loaderSettings);
        serializeAndUpdate("settings", loaderSettings);
    }

    /**
     * Get ehr count before the latest loader job from the DB
     * @return
     */
    public int getPreviousEHRCount() {
        return Integer.parseInt(load("ehr_count"));
    }

    /**
     * Update ehr count before the latest loader job in the DB
     * @return
     */
    public void updatePreviousEHRCount(int count) {
        update("ehr_count", Integer.toString(count));
    }

    private <R> R loadAndDeserialize(String key, Class<R> objClass) {
        try {
            return om.readerFor(objClass).readValue(load(key));
        } catch (JsonProcessingException e) {
            throw new LoaderException("Failed to deserialize object for loader_state update of key '" + key + "'", e);
        }
    }

    private <R> List<R> loadAndDeserializeList(String key, Class<R> objClass) {
        try {
            return om.readerForListOf(objClass).readValue(load(key));
        } catch (JsonProcessingException e) {
            throw new LoaderException("Failed to deserialize object for loader_state update of key '" + key + "'", e);
        }
    }

    private String load(String key) {
        try (Connection c = dataSource.getConnection();
                PreparedStatement s = c.prepareStatement("SELECT value FROM ehr.loader_state WHERE key = ?;")) {
            s.setString(1, key);
            try (ResultSet result = s.executeQuery()) {
                if (result.next()) {
                    return result.getString(1);
                } else {
                    throw new LoaderException("Could not find key '" + key + "' in ehr.loader_state");
                }
            }
        } catch (SQLException e) {
            throw new LoaderException("Failed to load loader_state value for key '" + key + "'", e);
        }
    }

    private void serializeAndUpdate(String key, Object value) {
        try {
            update(key, om.writeValueAsString(value));
        } catch (JsonProcessingException e) {
            throw new LoaderException("Failed to serialize object for loader_state update of key '" + key + "'", e);
        }
    }

    private void update(String key, String value) {
        try (Connection c = dataSource.getConnection();
                PreparedStatement s = c.prepareStatement("UPDATE ehr.loader_state SET value= ? WHERE key = ?;")) {
            s.setString(1, value);
            s.setString(2, key);
            s.executeUpdate();
        } catch (SQLException e) {
            throw new LoaderException("Failed to update loader_state for key '" + key + "'", e);
        }
    }
}
