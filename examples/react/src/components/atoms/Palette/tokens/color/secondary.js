const tinycolor = require('tinycolor2')

const color = '#4FBE0C'
const action = '#3B890B'

const alphas = {
  100: tinycolor(color).toRgbString(),
  45: tinycolor(color).setAlpha(0.45).toRgbString(),
}

const secondary = {
  ...alphas,
  default: alphas['100'],
  disabled: alphas['45'],
  action: tinycolor(action).toRgbString(),
}

module.exports = secondary
