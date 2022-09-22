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

The WebTester can also fill the DB with semi realistic data for testing purposes. When using the loader it is recommended to terminate all other connections (including ehrbase) to the database.
There are several application configuration parameters related to the data loading that you should be aware of:

| Name                                               | Description                                                            | Default Value                              | Comment                                  |
|----------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------|------------------------------------------|
| `loader.enabled`                                   | Set to true to enable it.                                              | false                                      |                                          |
| `spring.datasource.url`                            | JDBC URL of the database.                                              | `jdbc:postgresql://localhost:5432/ehrbase` |                                          |
| `spring.datasource.username`                       | Login username of the database.                                        | `ehrbase`                                  |                                          |
| `spring.datasource.password`                       | Login password of the database.                                        | `ehrbase`                                  |                                          |
| `spring.datasource.hikari.maximum-pool-size`       | Max. number of connections to use for inserting data                   | `15`                                       |                                          |
| `spring.datasource.hikarisecond.maximum-pool-size` | Max. number of connections to use for DDL statements.                  | `2`                                        |                                          |
| `loader.keepIndexes`                               | Whether the loader will delete indexes before inserting.               | `true`                                     |                                          |
| `loader.dbAdmin`                                   | Whether the DB user specified has superuser permissions.               | `true`                                     |                                          |
| `loader.matrixInsertThreads`                       | Number of threads to use for inserting data in the (PoC) Matrix model. | `10`                                       |                                          |
| `spring.profiles.active`                           | Regular spring setting to activate different profiles                  | ` `                                        | When using yugabyteDB set this to `yuga` |

It is recommended to start the service with the -Xmx and -XX:ActiveProcessorCount JVM options:
- Xmx:
  - will effectively limit the size of the EHR batches
  - with Xmx4G a batch size of 100 is safe (probably more, but since the size of the EHRs varies according to the distributions, it is best to leave some room)
- XX:ActiveProcessorCount: 
  - should be <= spring.datasource.hikari.maximum-pool-size
  - it is possible to use more threads than connections, but this may cause timeouts since the additional threads will have to wait for connections from the connection pool to become available.

When using yugabyteDB please make sure to set the "yuga" spring profile as active and set all the mentioned parameters, since the yugabyte profile changes some default values.

There are two modes for how compositions are inserted:
1. LEGACY:
   - inserts compositions compliant with the old data model queryable by the old AQL engine (tables: composition, entry, event_context, participation)
2. MATRIX:
   - inserts compositions in the model for the new PoC Matrix AQL engine (tables: entry2)

These modes can be combined. Please note that, if you insert in both models, it will take significantly longer.


A loader job consists of the following phases:
1. PRE_LOAD: 
   - collect necessary DB schema information
   - prepare the DB schema for data loading
2. PHASE_1:
   - Generate gaussian distributions
   - Create health_care_facilities and health care professionals for the facilities
   - Create and insert batches of EHRs and their associated data according to the distributions
   - If composition mode "LEGACY" was specified in the modes list:
     - For ehr.entry the data is inserted into temporary tables (ehr.entry_0 - ehr.entry_<n>, where n is the number of composition available in the loaders resources)
   - If composition mode "MATRIX" was specified in the modes list:
     - composition data including JSONB is inserted into ehr.entry2
3. PHASE_2:
   - If composition mode "LEGACY" was specified in the modes list:
     - Runs a batched DML statement for each composition "type" in parallel which deletes the data from the temporary entry tables and inserts into ehr.entry whilst adding the JSONB
4. POST_LOAD:
   - Restore the DB schema to the original state
     - If necessary recreate deleted indexes and unique constraints
     - If necessary reenable triggers on all tables
     - If composition mode "LEGACY" was specified in the modes list, remove the temporary entry tables

There are two additional "pseduo-phases" called NOT_RUN and FINISHED. NOT_RUN indicates that the loader was not run on this DB before. FINISHED indicates that a previous loader job was completed. It is safe to start a new job from the FINISHED state. Note that this will add new health_care_facilities and health care professionals with the same names as the ones from the previous job and that the distributions of the existing data and the new data wil not be independent.

Where possible the loader has simple retry mechanisms for failed DML/DDL statements. These mechanisms only allow retries up to a certain error count. If the error count is exceeded in any mechanism the loader will throw an Exception and stop the current execution.
To allow for resuming jobs that were interrupted by outside termination of the service or an Exception due to too many SQL errors, the loader will create a table in the "ehr" schema called loader_state. On startup the loader will check if the last "execution_state" in the DB indicates that the last job was interrupted. In that case it will automatically resume the last job. If the job was terminated by an Exception it can be resumed manually via the REST-API (see the link below).
The resume functionality currently comes with the following hints/limitations: 
1. Resuming is not allowed if the last phase is PRE_LOAD, since this phase collects statements for the POST_LOAD phase to restore the DB schema to its original state, saves them to ehr.loader_state and then runs some DDL statements to temporarily adapt the DB for the loading process. If an error happens during this phase it is recommended to reinitialize the DB. You can circumvent this measure by changing the "execution_state" in the loader_state table to "NOT_RUN" and start another job via the REST-API, after making sure the DB schema is still intact.
2. When resuming in PHASE_1 a new set of health_care_facilities is created with the same names as the previous ones and their own data distributions, because the distribution state is currently not persistent. 
3. If a resume during PHASE_1 happens, you should check the logs to see which part of the failed batch were already inserted and decide if you want to clean up rows with violated foreign keys after the job is finished (Common cleanups would be: missing ehr, missing ehr_status). For most test cases the cleanup is optional, since ehrbase should work fine, even if i.e. and ehr is missing, with the limitation that you may get the missing ehrs id through AQL.

For information on the REST-API see [https://github.com/ehrbase/webtester/wiki/Test-Data-Loader](https://github.com/ehrbase/webtester/wiki/Test-Data-Loader)

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
