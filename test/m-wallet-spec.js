const supertest = require('supertest');
const baseLibrary = require('../utils/base-library');
const mWalletData = require('../test-data/m-wallet-data.json');
const data = require('../test-data/message-data.json');

require('dotenv-safe').config();

const request = supertest(process.env.MPAY_BASE_URL),
  authToken = process.env.AUTH_TOKEN;

describe('Positive Test - Process Transaction : mWallet as payment source mWallet as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mWalletData.positiveTestData.mWalletPaymentSourceTomWalletDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body.transactionId).toBeTruthy;
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
  });
});

describe('Positive Test - Process Transaction : mWallet as payment source to mAccount as disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mWalletData.positiveTestData.mWalletPaymentSourceTomAccountDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body.transactionId).toBeTruthy;
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('feeAmountExcludingGst');
    expect(txnResponse.body).toHaveProperty('feeAmountGstComponent');
    expect(txnResponse.body).toHaveProperty('feeAmountIncludingGst');
  });
});

describe('Positive Test - Process Transaction : mWallet as payment source to DirectCredit disbursement tranfer amount 0.01 ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mWalletData.positiveTestData
          .mWalletPaymentSourceTodirectCreditDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body.transactionId).toBeTruthy;
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('feeAmountExcludingGst');
    expect(txnResponse.body).toHaveProperty('feeAmountGstComponent');
    expect(txnResponse.body).toHaveProperty('feeAmountIncludingGst');
  });
});

describe('Positive Test - Process Transaction : mWallet as payment source to BPAY disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mWalletData.positiveTestData.mWalletPaymentSourceToBPayDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.transactionId).toBeTruthy;
    expect(txnResponse.body.bpayReceipts[0].amount).toBe(data.amount);
    expect(txnResponse.body.bpayReceipts[0].billerCode).toBe(data.billerCode);
    expect(txnResponse.body.bpayReceipts[0].receiptNumber).toBeTruthy();
    expect(txnResponse.body.bpayReceipts[0].referenceNumber).toBeTruthy();
  });
});

describe('Negative Test - Process Transaction : Error when incorrect BSB is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mWalletData.negativeTestData.invalidBSBNumber);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(data.invalidBSBNumber);
    expect(txnResponse.body.status).toContain(
      'FinancialValidateDisbursementDirectCreditDetailsAreInvalid'
    );
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.bpayReceipts).toBeNull();
  });
});

describe('Negative Test - Process Transaction : Error when incorrect Account is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mWalletData.negativeTestData.invalidAccountNumber);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidAccountNumber
    );
    expect(txnResponse.body.status).toContain(
      'FinancialValidateDisbursementDirectCreditDetailsAreInvalid'
    );
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.bpayReceipts).toBeNull();
  });
});

describe('Negative Test - Process Transaction : Error when incorrect 1.0001 Amount is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mWalletData.negativeTestData.invalidTotalAmount);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidWalletTotalAmount
    );
    expect(txnResponse.body.status).toContain(
      'FinancialValidateInvalidTotalAmount'
    );
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.bpayReceipts).toBeNull();
  });
});
