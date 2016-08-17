Feature: GOV.UK Template
  As a person that uses government services
  I want this application to have the familiar GOV.UK look and feel
  So that I feel like I can trust it

Scenario: Valid page
  When I visit the application root
  Then I should see the GOV.UK template
