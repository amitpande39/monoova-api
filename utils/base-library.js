const supertest = require('supertest');
require('dotenv-safe').config();
module.exports = {
  async authHeaderGeneric() {
    return {
      'Content-Type': 'application/json',
    };
  },
};
