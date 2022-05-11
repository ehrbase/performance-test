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


## Credentials

Default credentials for basic authentication are:

- Username: webtester
- Password: Dctm1234
