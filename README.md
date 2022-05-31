# EHRbase Performance Tests

[![EHRbase Performance Tests](https://github.com/ehrbase/webtester/actions/workflows/load-tests.yml/badge.svg)](https://github.com/ehrbase/ehrbase-load-test/actions/workflows/load-tests.yml)

Last execution report: https://ehrbase.github.io/ehrbase-load-test/

# WebTester [![build](https://github.com/ehrbase/webtester/actions/workflows/build.yaml/badge.svg)](https://github.com/ehrbase/webtester/actions/workflows/build.yaml)

WebTester in simple web application that wraps [Apache JMeter](https://jmeter.apache.org/) and provides a REST API to
execute performance tests on remote instances of [EHRbase](https://ehrbase.org/) without network/connectivity issue.

## Getting start

### Prerequisites

The only prerequisite is that you have [Docker](https://www.docker.com/products/docker-desktop) installed on your
machine.

### Start the application

First step is to start a container using `docker run` command:

```shell
$ docker run -p 8080:8080 --name webtester -d ehrbase/webtester:next
```

After downloading the Docker image, the result of the command above should look like:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.6.4)

2022-03-17 07:43:00.621  INFO 1 --- [           main] o.e.webtester.WebTesterApplication       : Starting WebTesterApplication v1.0.0-SNAPSHOT using Java 11.0.14.1 on 8afb96f1b435 with PID 1 (/app.jar started by root in /)
2022-03-17 07:43:00.624  INFO 1 --- [           main] o.e.webtester.WebTesterApplication       : No active profile set, falling back to 1 default profile: "default"
2022-03-17 07:43:01.707  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-03-17 07:43:01.707  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.58]
2022-03-17 07:43:01.742  INFO 1 --- [           main] o.a.c.c.C.[.[localhost].[/webtester]     : Initializing Spring embedded WebApplicationContext
2022-03-17 07:43:01.905  INFO 1 --- [           main] o.e.w.config.jmeter.JMeterConfiguration  : Initializing Apache JMeter 5.4.3
2022-03-17 07:43:02.320  INFO 1 --- [           main] o.e.webtester.WebTesterApplication       : Started WebTesterApplication in 2.086 seconds (JVM running for 2.425)
```

And the WebTester application should be at [http://localhost:8080/webtester](http://localhost:8080/webtester).

You can now start to use the WebTester through
the [REST API](https://github.com/ehrbase/webtester/wiki/REST-API-Reference).

## Building from source code

### Prerequisites

- Java 11
- Apache Maven

### Build the application

```shell
$ mvn clean install
```

## Data Loading

The WebTester can also fill the DB with dummy data. For this you need to configure. 

| Name                         | Description                     | Default Value                              |
|------------------------------|---------------------------------|--------------------------------------------|
| `loader.enabled`             | Set to true to enable it.       | false                                      |
| `spring.datasource.url`      | JDBC URL of the database.       | `jdbc:postgresql://localhost:5432/ehrbase` |
| `spring.datasource.username` | Login username of the database. | `ehrbase`                                  |
| `spring.datasource.password` | Login password of the database. | `ehrbase`                                  |

For the API Call see [REST API](https://github.com/ehrbase/webtester/wiki/Test-Data-Loader)

## Credentials

Default credentials for basic authentication are:

- Username: webtester
- Password: Dctm1234

## Contributing

### Codestyle/Formatting
Java sourcecode is using [palantir-java-format](https://github.com/palantir/palantir-java-format) codestyle.
The formatting is checked and applied using the [spotless-maven-plugin](https://github.com/diffplug/spotless/tree/main/plugin-maven).
To apply the codestyle run the `com.diffplug.spotless:spotless-maven-plugin:apply` maven goal in the root directory of the project.
To check if the code conforms to the codestyle run the `com.diffplug.spotless:spotless-maven-plugin:check` maven goal in the root directory of the project.

To make sure all code conforms to the codestyle, the "check-codestyle" check is run on all pull requests.
Pull requests not passing this check shall not be merged.

If you wish to automatically apply the formatting on commit for *.java files, a simple pre-commit hook script "pre-commit.sh" is available in the root directory of this repository.
To enable the hook you can either copy the script to or create a symlink for it at `.git/hooks/pre-commit`.
The git hook will run the "apply" goal for the whole project, but formatting changes will only be staged for already staged files, to avoid including unrelated changes.

In case there is a section of code that you carefully formatted in a special way the formatting can be turned off for that section like this:
```
everything here will be reformatted..

// @formatter:off

    This is not affected by spotless-plugin reformatting...
            And will stay as is it is!

// @formatter:on

everything here will be reformatted..
```
Please be aware that `@formatter:off/on` should only be used on rare occasions to increase readability of complex code and shall be looked at critically when reviewing merge requests.
