const request = require('supertest');
const helper = require('./support/integrationSpecHelper');
const expect = require('chai').expect;

describe('Secure headers', () => {
  before(() =>
    request(helper.app)
      .get('/')
      .then(response => {
        this.response = response;
      })
  );

  it('should not send x-powered-by', () =>
    expect(this.response.headers).not.to.have.property('x-powered-by')
  );

  [
    { header: 'referrer-policy', value: 'no-referrer' },
    { header: 'x-dns-prefetch-control', value: 'off' },
    { header: 'x-frame-options', value: 'SAMEORIGIN' },
    { header: 'x-download-options', value: 'noopen' },
    { header: 'x-content-type-options', value: 'nosniff' },
    { header: 'x-xss-protection', value: '1; mode=block' },
    { header: 'surrogate-control', value: 'no-store' },
    { header: 'cache-control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
    { header: 'pragma', value: 'no-cache' },
    { header: 'expires', value: '0' },
  ].forEach(s => {
    it(`should send ${s.header}`, () =>
      expect(this.response.headers).to.have.property(s.header, s.value)
    );
  });
});
