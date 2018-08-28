class Routes {
  constructor(basePath) {
    this.basePath = basePath;
  }

  baseUrl(url) {
    return `${this.basePath}${url}`;
  }

  mainUrl() {
    return this.baseUrl('/');
  }

  cookieUrl() {
    return this.baseUrl('/cookie');
  }

}

module.exports = Routes;
