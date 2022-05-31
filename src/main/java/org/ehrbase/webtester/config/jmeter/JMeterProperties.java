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
package org.ehrbase.webtester.config.jmeter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * {@link ConfigurationProperties} to configure Apache JMeter.
 *
 * @author Renaud Subiger
 * @since 1.0
 */
@ConfigurationProperties(prefix = "jmeter")
public class JMeterProperties {

    private String installDir;

    private String testPlanDir;

    private String testExecutionDir;

    public String getInstallDir() {
        return installDir;
    }

    public void setInstallDir(String installDir) {
        this.installDir = installDir;
    }

    public String getTestPlanDir() {
        return testPlanDir;
    }

    public void setTestPlanDir(String testPlanDir) {
        this.testPlanDir = testPlanDir;
    }

    public String getTestExecutionDir() {
        return testExecutionDir;
    }

    public void setTestExecutionDir(String testExecutionDir) {
        this.testExecutionDir = testExecutionDir;
    }
}
