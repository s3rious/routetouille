const tinycolor = require('tinycolor2')

const main = '#FFFFFF'
const accent = '#F4F4F4'
const alternative = '#000000'

const background = {
  default: tinycolor(main).toRgbString(),
  overlay: tinycolor(accent).setAlpha(0.85).toRgbString(),
  muted: tinycolor(accent).setAlpha(0.85).toRgbString(),
  minor: tinycolor(alternative).setAlpha(0.05).toRgbString(),
  border: tinycolor(alternative).setAlpha(0.1).toRgbString(),
}

module.exports = background
