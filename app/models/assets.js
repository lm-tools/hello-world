const versionedAssets = require('../../dist/public/rev-manifest.json');

module.exports = ({ assetPath }) => (
  {
    css: [
      `${assetPath}${versionedAssets['stylesheets/style.css']}`,
    ],
    js: [
      `${assetPath}${versionedAssets['js/jquery.min.js']}`,
      `${assetPath}${versionedAssets['js/selection-buttons.js']}`,
      `${assetPath}${versionedAssets['js/main.js']}`,
    ],
  }
);
