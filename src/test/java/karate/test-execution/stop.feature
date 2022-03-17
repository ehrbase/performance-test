@ignore
Feature:

  Scenario:
    Given url baseUrl
    Given path '/rest/jmeter/stop'
    And header Authorization = call read('classpath:basic-auth.js')
    And param immediate = true
    When method post
    Then status 204
