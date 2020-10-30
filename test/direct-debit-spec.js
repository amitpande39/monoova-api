const supertest = require('supertest');
const baseLibrary = require('../utils/base-library');
const directDebitData = require('../test-data/direct-debit-data.json');
const data = require('../test-data/message-data.json');

require('dotenv-safe').config();

const request = supertest(process.env.MPAY_BASE_URL),
  authToken = process.env.AUTH_TOKEN;

describe('Positive Test - Process Transaction : DirectDebit as payment source to Direct debit account ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(directDebitData.positiveTestData.directDebitDisbursment);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('feeAmountExcludingGst');
    expect(txnResponse.body).toHaveProperty('feeAmountGstComponent');
    expect(txnResponse.body).toHaveProperty('feeAmountIncludingGst');
  });
});

describe('Positive Test - Process Transaction : DirectDebit as payment source to mWallet as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(directDebitData.positiveTestData.directDebitTomWalletDisbursement);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.transactionId).toBeTruthy();
    expect(txnResponse.body.feeAmountExcludingGst).toBe(0.8);
    expect(txnResponse.body.feeAmountGstComponent).toBe(0.08);
    expect(txnResponse.body.feeAmountIncludingGst).toBe(0.88);
  });
});

describe('Positive Test - Process Transaction : DirectDebit as payment source to mAccount as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(directDebitData.positiveTestData.directDebitTomAccountDisbursement);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.transactionId).toBeTruthy();
    expect(txnResponse.body.feeAmountExcludingGst).toBe(0.8);
    expect(txnResponse.body.feeAmountGstComponent).toBe(0.08);
    expect(txnResponse.body.feeAmountIncludingGst).toBe(0.88);
  });
});

describe('Positive Test - Process Transaction : DirectDebit as payment source to DirectCredit as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async (done) => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        directDebitData.positiveTestData.directDebitToDirectCreditAsDisbursement
      );
    done();
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.transactionId).toBeTruthy();
    expect(txnResponse.body.feeAmountExcludingGst).toBe(1.6);
    expect(txnResponse.body.feeAmountGstComponent).toBe(0.16);
    expect(txnResponse.body.feeAmountIncludingGst).toBe(1.76);
  });
});

describe('Positive Test - Process Transaction : DirectDebit as payment source to BPAY as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(directDebitData.positiveTestData.directDebitToBPayAsDisbursement);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.transactionId).toBeTruthy();
    expect(txnResponse.body.feeAmountExcludingGst).toBe(1.4);
    expect(txnResponse.body.feeAmountGstComponent).toBe(0.14);
    expect(txnResponse.body.feeAmountIncludingGst).toBe(1.54);
  });
});
