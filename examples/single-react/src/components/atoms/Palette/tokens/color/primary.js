const tinycolor = require('tinycolor2')

const color = '#447ACA'
const action = '#3464AB'

const alphas = {
  100: tinycolor(color).toRgbString(),
  45: tinycolor(color).setAlpha(0.45).toRgbString(),
  25: tinycolor(color).setAlpha(0.25).toRgbString(),
  10: tinycolor(color).setAlpha(0.1).toRgbString(),
}

const primary = {
  ...alphas,
  default: alphas['100'],
  disabled: alphas['45'],
  action: tinycolor(action).toRgbString(),
}

module.exports = primary
