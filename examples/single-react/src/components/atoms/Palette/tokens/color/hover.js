const tinycolor = require('tinycolor2')

const color = '#D80947'

const alphas = {
  100: tinycolor(color).toRgbString(),
  45: tinycolor(color).setAlpha(0.45).toRgbString(),
}

const primary = {
  ...alphas,
  default: alphas['100'],
  disabled: alphas['45'],
}

module.exports = primary
