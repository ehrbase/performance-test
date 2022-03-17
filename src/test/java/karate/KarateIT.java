package karate;

import com.intuit.karate.junit5.Karate;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.util.stream.Collectors;

class KarateIT {

    @Karate.Test
    Karate test() {
        return Karate.run("classpath:karate")
                .outputCucumberJson(true)
                .relativeTo(getClass());
    }

    public static void generateReport(String karateOutputPath) {
        var jsonFiles = FileUtils.listFiles(new File(karateOutputPath), new String[]{"json"}, true);
        var jsonPaths = jsonFiles.stream()
                .map(File::getAbsolutePath)
                .collect(Collectors.toList());
        var config = new Configuration(new File("target"), "demo");
        var reportBuilder = new ReportBuilder(jsonPaths, config);
        reportBuilder.generateReports();
    }
}
