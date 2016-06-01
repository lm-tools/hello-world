$(document).ready(() => {
  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  const $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  // eslint-disable-next-line no-new
  new GOVUK.SelectionButtons($blockLabels);
});
