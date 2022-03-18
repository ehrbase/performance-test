@ignore
Feature:

  Scenario:
    Given url baseUrl
    Given path '/rest/jmeter'
    And header Authorization = call read('classpath:basic-auth.js')
    When method get
    Then status 200
