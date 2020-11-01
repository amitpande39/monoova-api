# Monoova API Tests written using Supertest & Jest runner

## Overview of scenarios

- Process a Transaction: APIs Positive, Negative, BVA, EP specs including a combination of various payment source and disbursement methods are covered for the following functionality:
  - Payment Source
    - mAccount
    - mWallet
    - DirectDebit
  - Disbursement
    - tomAccount
    - tomWallet
    - toDirectDebit
    - toBpay

## Test Execution

- Checkout or unzip this project
- Navigate to root level directory
- Perform `npm install` then
- Perform `npm test` to run your tests

## Test Report

- A report is generated after test execution at the following location:
  `html-report` >> `report.html`
- Open `report.html` in browser to see the report of execution
