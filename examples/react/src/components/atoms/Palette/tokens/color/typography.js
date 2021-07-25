const tinycolor = require('tinycolor2')

const onBackground = 'rgb(0, 0, 0)'
const onColor = 'rgb(255, 255, 255)'

const onBackgroundAlphas = {
  90: tinycolor(onBackground).setAlpha(0.9).toRgbString(),
  65: tinycolor(onBackground).setAlpha(0.65).toRgbString(),
  45: tinycolor(onBackground).setAlpha(0.45).toRgbString(),
  25: tinycolor(onBackground).setAlpha(0.25).toRgbString(),
}

const onColorAlphas = {
  100: tinycolor(onColor).toRgbString(),
  65: tinycolor(onColor).setAlpha(0.65).toRgbString(),
  45: tinycolor(onColor).setAlpha(0.45).toRgbString(),
  25: tinycolor(onColor).setAlpha(0.25).toRgbString(),
}

const typography = {
  onBackground: {
    ...onBackgroundAlphas,
    default: onBackgroundAlphas['90'],
    additional: onBackgroundAlphas['65'],
    minor: onBackgroundAlphas['45'],
    muted: onBackgroundAlphas['25'],
  },
  onColor: {
    ...onColorAlphas,
    default: onColorAlphas['100'],
    additional: onColorAlphas['65'],
    minor: onColorAlphas['45'],
    muted: onColorAlphas['25'],
  },
}

module.exports = typography
