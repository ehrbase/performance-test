Feature: Test Plan

  Background:
    * url baseUrl

  Scenario: List test plans
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200

  Scenario: Upload test plan
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: 'demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201
    And match header location contains 'demo_test_plan'

    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200
    And match response contains 'demo_test_plan'

  Scenario: Upload invalid test plan
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: 'demo_test_plan.jmx', filename: 'dummy.txt', contentType: 'application/xml' }
    When method post
    Then status 500
    And match response $.message == 'Invalid file extension'

  Scenario: Download test plan
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: 'demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201

    Given path '/rest/jmeter/test-plans/demo_test_plan'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200
    And match header content-type == 'application/xml'
    And match header content-disposition contains 'demo_test_plan.jmx'

  Scenario: Start test plan
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: 'demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201

    Given path '/rest/jmeter/test-plans/demo_test_plan/start'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 202
    And match header location contains '/jmeter/test-executions'

  Scenario: Start test plan
    Given path '/rest/jmeter/test-plans'
    And header Authorization = call read('classpath:basic-auth.js')
    And multipart file file = { read: 'demo_test_plan.jmx', filename: 'demo_test_plan.jmx', contentType: 'application/xml' }
    When method post
    Then status 201

    Given path '/rest/jmeter/test-plans/demo_test_plan/start'
    And header Authorization = call read('classpath:basic-auth.js')
    And request { loopCount: 2 }
    When method post
    Then status 202
    And match header location contains '/jmeter/test-executions'

  Scenario: Start invalid test plan
    Given path '/rest/jmeter/test-plans/dummy/start'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 500
    And match response $.message contains 'dummy.jmx not found'