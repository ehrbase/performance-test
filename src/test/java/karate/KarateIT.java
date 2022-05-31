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
package karate;

import com.intuit.karate.junit5.Karate;
import java.io.File;
import java.util.stream.Collectors;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.apache.commons.io.FileUtils;

class KarateIT {

    @Karate.Test
    Karate test() {
        return Karate.run("classpath:karate").outputCucumberJson(true).relativeTo(getClass());
    }

    public static void generateReport(String karateOutputPath) {
        var jsonFiles = FileUtils.listFiles(new File(karateOutputPath), new String[] {"json"}, true);
        var jsonPaths = jsonFiles.stream().map(File::getAbsolutePath).collect(Collectors.toList());
        var config = new Configuration(new File("target"), "demo");
        var reportBuilder = new ReportBuilder(jsonPaths, config);
        reportBuilder.generateReports();
    }
}
