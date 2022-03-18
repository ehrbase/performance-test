Feature: JMeter Engine

  Background:
    * url baseUrl

  Scenario: Get status
    Given path '/rest/jmeter'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200
    And match response $.active == false

  Scenario: Stop test
    Given path '/rest/jmeter/stop'
    And header Authorization = call read('classpath:basic-auth.js')
    When method post
    Then status 204

  Scenario: Stop test (immediate)
    Given path '/rest/jmeter/stop'
    And header Authorization = call read('classpath:basic-auth.js')
    And param immediate = true
    When method post
    Then status 204
