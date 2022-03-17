Feature: Test Execution

  Background:
    * url baseUrl

    * def stopTest =
    """
    function() {
        karate.call('stop.feature');
    }
    """

    * def waitUntil =
    """
    function() {
      while (true) {
        var result = karate.call('ready.feature');
        var status = result.response;
        karate.log('poll response', status);
        if (status.active == false) {
          karate.log('condition satisfied, exiting');
          return;
        }
        karate.log('sleeping');
        java.lang.Thread.sleep(1000);
      }
    }
    """

  Scenario: Get log file

    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: '../test-plan/demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201

    Given path '/rest/jmeter/test-plans/demo_test_plan/start'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 202
    And match header location contains '/jmeter/test-executions'
    And def location = responseHeaders['Location'][0]
    And def executionId = location.substring(location.lastIndexOf('/') + 1)
    And call waitUntil

    Given path '/rest/jmeter/test-executions/' + executionId + '/logfile'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200

  Scenario: Get invalid log file
    Given path '/rest/jmeter/test-executions/invalid/logfile'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 500
    And match response $.message contains 'log.jtl not found'

  Scenario: Generate invalid report
    Given path '/rest/jmeter/test-executions/invalid/generate-report'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 500
    And match response $.message contains 'log.jtl not found'

  Scenario: Get invalid report
    Given path '/rest/jmeter/test-executions/invalid/report'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 500
    And match response $.message contains 'report not found'

  Scenario: Get report
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: '../test-plan/demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201

    Given path '/rest/jmeter/test-plans/demo_test_plan/start'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 202
    And match header location contains '/jmeter/test-executions'
    And def location = responseHeaders['Location'][0]
    And def executionId = location.substring(location.lastIndexOf('/') + 1)
    And call waitUntil

    Given path '/rest/jmeter/test-executions/' + executionId + '/generate-report'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 202

    Given path '/rest/jmeter/test-executions/' + executionId + '/report'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200
    And match header content-type == 'application/octet-stream'
    And match header content-disposition contains 'report.zip'