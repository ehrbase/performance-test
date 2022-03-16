/*
 * Copyright 2022 vitasystems GmbH and Hannover Medical School.
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

package org.ehrbase.webtester.service;

import net.lingala.zip4j.ZipFile;
import org.apache.commons.io.FilenameUtils;
import org.apache.jmeter.JMeter;
import org.apache.jmeter.engine.JMeterEngine;
import org.apache.jmeter.engine.JMeterEngineException;
import org.apache.jmeter.gui.action.Save;
import org.apache.jmeter.report.config.ConfigurationException;
import org.apache.jmeter.report.dashboard.GenerationException;
import org.apache.jmeter.report.dashboard.ReportGenerator;
import org.apache.jmeter.reporters.ResultCollector;
import org.apache.jmeter.reporters.Summariser;
import org.apache.jmeter.save.SaveService;
import org.apache.jmeter.util.JMeterUtils;
import org.apache.jorphan.collections.HashTree;
import org.ehrbase.webtester.exception.WebTesterException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service that implements convenient methods for using Apache JMeter and {@link JMeterEngine}.
 *
 * @author Renaud Subiger
 * @since 1.0
 */
@Service
public class JMeterService {

    public static final String JMX_EXTENSION = "jmx";

    public static final String LOG_FILE = "log.jtl";

    public static final String REPORT_DIR = "report";

    public static final String REPORT_FILE = "report.zip";

    private final JMeterEngine jmeterEngine;

    @Value("${jmeter.test-plan-dir}")
    private String testPlanDir;

    @Value("${jmeter.test-execution-dir}")
    private String testExecutionDir;

    public JMeterService(JMeterEngine jmeterEngine) {
        this.jmeterEngine = jmeterEngine;
    }

    /**
     * List all JMeter Test Plan identifiers.
     *
     * @return the list of JMeter Test Plan identifiers
     */
    public List<String> listTestPlans() {
        try (var files = Files.list(Path.of(testPlanDir))) {
            return files
                    .map(Path::getFileName)
                    .map(path -> getTestPlanId(path.toString()))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new WebTesterException("Failed to list the files on the filesystem", e);
        }
    }

    /**
     * Saves the given JMeter Test Plan on the filesystem.
     *
     * @param in       the input stream to read from
     * @param filename the original filename
     * @return the identifier of the JMeter Test Plan
     */
    public String saveTestPlan(InputStream in, String filename) {
        if (!FilenameUtils.isExtension(filename, JMX_EXTENSION)) {
            throw new WebTesterException("Invalid file extension");
        }

        var path = Path.of(testPlanDir, filename);
        try {
            Files.copy(in, path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new WebTesterException("Failed to save the file on the filesystem", e);
        }

        return FilenameUtils.getBaseName(filename);
    }

    /**
     * Retrieves the JMeter Test Plan with the given identifier.
     *
     * @param testPlanId the identifier of the JMeter Test Plan
     * @return the input stream
     */
    public InputStream getTestPlan(String testPlanId) {
        var path = getTestPlanPath(testPlanId);

        try {
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new WebTesterException("Failed to read the file from the filesystem", e);
        }
    }

    /**
     * Starts the JMeter Test Plan with the given parameters.
     *
     * @param testPlanId the identifier of the JMeter Test Plan
     * @param parameters the parameters used in the JMeter Test Plan, {@code null} otherwise
     * @return the identifier of the test execution
     */
    public String startTest(String testPlanId, Map<String, Object> parameters) {
        if (isActive()) {
            throw new WebTesterException("JMeterEngine is already running");
        }

        if (parameters != null) {
            var jmeterProperties = JMeterUtils.getJMeterProperties();
            parameters.forEach((key, value) -> jmeterProperties.put(key, value.toString()));
        }

        var testPlanPath = getTestPlanPath(testPlanId);
        HashTree testPlan;
        try {
            testPlan = SaveService.loadTree(testPlanPath.toFile());
        } catch (IOException e) {
            throw new WebTesterException("Failed to load the JMeter Test Plan", e);
        }

        String executionId = UUID.randomUUID().toString();
        var executionOutputDir = Path.of(testExecutionDir, executionId);

        try {
            Files.createDirectories(executionOutputDir);
        } catch (IOException e) {
            throw new WebTesterException("Failed to create the output directory for the test execution ", e);
        }

        var logFilePath = getLogFilePath(executionId, false);
        var resultCollector = new ResultCollector(new Summariser("summary"));
        resultCollector.setFilename(logFilePath.toString());
        testPlan.add(testPlan.getArray()[0], resultCollector);

        try {
            jmeterEngine.configure(testPlan);
            jmeterEngine.runTest();
        } catch (JMeterEngineException e) {
            throw new WebTesterException("Failed to start the JMeter Test Plan", e);
        }

        return executionId;
    }

    /**
     * Retrieves the log file for the given test execution.
     *
     * @param executionId the identifier of the test execution
     * @return the input stream
     */
    public InputStream getLogFile(String executionId) {
        var path = getLogFilePath(executionId, true);
        try {
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new WebTesterException("Failed to read the log file for the test execution", e);
        }
    }

    /**
     * Generates the dashboard report for the given test execution.
     *
     * @param executionId the identifier of the test execution
     */
    public void generateReport(String executionId) {
        var logFile = getLogFilePath(executionId, true);

        var reportDirectory = getReportPath(executionId);
        JMeterUtils.setProperty(JMeter.JMETER_REPORT_OUTPUT_DIR_PROPERTY, reportDirectory.toString());

        try {
            var generator = new ReportGenerator(logFile.toString(), null);
            generator.generate();
        } catch (ConfigurationException | GenerationException e) {
            throw new WebTesterException("Failed to generate the report for the test execution", e);
        }
    }

    /**
     * Retrieves the log file for the given test execution.
     *
     * @param executionId the identifier of the test execution
     * @return the input stream
     */
    public InputStream getReport(String executionId) {
        var report = getReportPath(executionId);
        if (Files.notExists(report)) {
            throw new WebTesterException("Report " + report + "not found");
        }

        var zipReport = Path.of(testExecutionDir, executionId, REPORT_FILE);
        if (Files.notExists(zipReport)) {
            try (ZipFile zipFile = new ZipFile(zipReport.toFile())) {
                zipFile.addFolder(report.toFile());
            } catch (IOException e) {
                throw new WebTesterException("Failed to create the zip file containing the report");
            }
        }

        try {
            return Files.newInputStream(zipReport);
        } catch (IOException e) {
            throw new WebTesterException("Failed to read the zip file containing the report", e);
        }
    }

    /**
     * Checks if the {@link JMeterEngine} is active (currently running a test) or not.
     *
     * @return {@code true} if the {@link JMeterEngine} is active
     */
    public boolean isActive() {
        return jmeterEngine.isActive();
    }

    /**
     * Stops the running test.
     *
     * @param immediate whether stop is immediate or wait for current sample end
     */
    public void stopTest(boolean immediate) {
        jmeterEngine.stopTest(immediate);
    }

    public String getTestPlanId(String filename) {
        return FilenameUtils.getBaseName(filename);
    }

    public String getTestPlanFilename(String testPlanId) {
        return testPlanId + Save.JMX_FILE_EXTENSION;
    }

    public Path getTestPlanPath(String testPlanId) {
        var path = Path.of(testPlanDir, getTestPlanFilename(testPlanId));
        if (Files.notExists(path)) {
            throw new WebTesterException("JMeter Test Plan " + path + " not found");
        }
        return path;
    }

    public Path getLogFilePath(String executionId, boolean assertExists) {
        var path = Path.of(testExecutionDir, executionId, LOG_FILE);
        if (assertExists && Files.notExists(path)) {
            throw new WebTesterException("Log file " + path + " not found");
        }
        return path;
    }

    public Path getReportPath(String executionId) {
        return Path.of(testExecutionDir, executionId, REPORT_DIR);
    }
}
