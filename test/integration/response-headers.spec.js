const request = require('supertest');
const helper = require('./support/integrationSpecHelper');
const expect = require('chai').expect;
const layoutAssets = require('../../app/models/assets')({ assetPath: '/' });

describe('Response headers', () => {
  describe('for dynamic html', () => {
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


  [
    { title: 'for images', path: '/vendor/v1/images/gov.uk_logotype_crown_invert_trans.png' },
    { title: 'for stylesheets', path: '/vendor/v1/stylesheets/govuk-template.css' },
    { title: 'for govuk javascript', path: '/vendor/v1/javascripts/govuk-template.js' },
    { title: 'for app javascript', path: layoutAssets.js[0] },
  ].forEach(d => {
    describe(d.title, () => {
      before(() =>
        request(helper.app)
          .get(d.path)
          .then(response => {
            this.response = response;
          })
      );

      [
        'surrogate-control',
        'pragma',
        'expires',
      ].forEach(s => {
        it(`should not send ${s}`, () =>
          expect(this.response.headers).not.to.have.property(s)
        );
      });

      it('should send correct Cache-Control header', () =>
        expect(this.response.headers).to.have.property('cache-control', 'public, max-age=3153600')
      );
      it('should send ETag for caching', () =>
        expect(this.response.headers).to.have.property('etag')
      );
    });
  });
});
