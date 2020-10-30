const supertest = require('supertest');
const baseLibrary = require('../utils/base-library');
const mAccountData = require('../test-data/m-account-data.json');
const data = require('../test-data/message-data.json');

require('dotenv-safe').config();

const request = supertest(process.env.MPAY_BASE_URL),
  authToken = process.env.AUTH_TOKEN;

describe('Positive Test - Process Transaction : mAccount as a payment source to Bpay Disbursement ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.positiveTestData.mAccountPmtSrcTobPayDisbursement);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with operation successful message in response', () => {
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

describe('Positive Test - Process Transaction : mAccount as a payment source to mWallet Disbursment ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.positiveTestData.mAccountPmtSrcTomWalletDisbursement);
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with operation successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('transactionId');
    expect(txnResponse.body).toHaveProperty('feeAmountExcludingGst');
    expect(txnResponse.body).toHaveProperty('feeAmountGstComponent');
    expect(txnResponse.body).toHaveProperty('feeAmountIncludingGst');
  });
});

describe('Positive Test - Process Transaction : mAccount as a payment source to mAccount as Disbursment ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mAccountData.positiveTestData
          .mAccountPmtSrcToAnothermAccountDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with operation successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('transactionId');
    expect(txnResponse.body).toHaveProperty('feeAmountExcludingGst');
    expect(txnResponse.body).toHaveProperty('feeAmountGstComponent');
    expect(txnResponse.body).toHaveProperty('feeAmountIncludingGst');
  });
});

describe('Positive Test - Process Transaction : mAccount as a payment source to DirectCredit as Disbursment ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(
        mAccountData.positiveTestData.mAccountPmtSrcTodirectCreditDisbursement
      );
  });
  it('returns 200 status code', () => {
    expect(txnResponse.statusCode).toBe(200);
  });
  it('returns expected properties and values with operation successful message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.successfulTxnMessage
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body).toHaveProperty('transactionId');
    expect(txnResponse.body.feeAmountExcludingGst).toBeTruthy;
    expect(txnResponse.body.feeAmountGstComponent).toBeTruthy;
    expect(txnResponse.body.feeAmountIncludingGst).toBeTruthy;
  });
});

describe('Negative Test - Process Transaction : Error when mWallet not supplied for BPAY Transaction ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.noMwalletSuppliedForBpayTnx);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.validMwalletTxnMessage
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
  });
});

describe('Negative Test - Process Transaction : Error when mAccount token is incorrect ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidMAccountToken);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidMAccountToken
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.status).toContain('InvalidMAccount');
  });
});

describe('Negative Test - Process Transaction : Error when mWallet token is incorrect ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidMWalleToken);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidMwalletToken
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.status).toContain('InvalidMWallet');
  });
});

describe('Negative Test - Process Transaction : Error when wrong biller code is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidBillerCode);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidBillerCode
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.status).toContain('BpayValidationError');
  });
});

describe('Negative Test - Process Transaction : Error when wrong reference number is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidReferenceNumber);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidReferenceNumber
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.status).toContain('BpayValidationError');
  });
});

describe('Negative Test - Process Transaction : Error when invalidate pin is supplied ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidCustomerPin);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidCustomerPin
    );
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.status).toContain('InvalidCustomerPin');
  });
});

describe('Negative Test - Process Transaction : Error when Amount is 0 ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidZeroAmount);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(data.invalidAmount);
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.feeBreakdown).toBeNull;
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.status).toContain('InvalidTotalAmount');
  });
});

describe('Negative Test - Process Transaction : Invalid total amount when Amount is 0.001 ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.invalidTotalAmount);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.invalidTotalAmount
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.feeBreakdown).toBeNull;
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.status).toContain(
      'FinancialValidateInvalidTotalAmount'
    );
  });
});

describe('Negative Test - Process Transaction : Validation failed for BPAY when the amount is < AU$10.00 ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.disbusmentBpayAmountIsInvalid);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.disbursementBpayAmountIsInvalid
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.feeBreakdown).toBeNull;
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.status).toContain(
      'FinancialValidateDisbursementBpayAmountIsInvalid'
    );
  });
});

describe('Negative Test - Process Transaction : Validation failed for Transaction exceeding maximum limit amount ==>', () => {
  let txnResponse, authHeaderGeneric;

  beforeAll(async () => {
    authHeaderGeneric = await baseLibrary.authHeaderGeneric();
    txnResponse = await request
      .post('/financial/v2/transaction/execute')
      .auth(authToken)
      .set(authHeaderGeneric)
      .send(mAccountData.negativeTestData.exceedingMaximumTransactionAmount);
  });
  it('returns 400 status code', () => {
    expect(txnResponse.statusCode).toBe(400);
  });
  it('returns expected properties and values with an error message in response', () => {
    expect(txnResponse.body.statusDescription).toContain(
      data.exceedMaxTransactionLimit
    );
    expect(txnResponse.body).toHaveProperty('callerUniqueReference');
    expect(txnResponse.body.bpayReceipts).toBeNull;
    expect(txnResponse.body.feeBreakdown).toBeNull;
    expect(txnResponse.body.transactionId).toBe(0);
    expect(txnResponse.body.status).toContain(
      'FinancialValidateTotalAmountIsMoreThanMaxTransactionLimit'
    );
  });
});
