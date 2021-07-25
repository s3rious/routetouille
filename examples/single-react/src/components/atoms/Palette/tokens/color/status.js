const tinycolor = require('tinycolor2')

const colors = [
  ['error', '#FF4136'],
  ['success', '#4FBE0C'],
  ['warning', '#FFA324'],
]

const alphas = [1, 0.25, 0.1]

const status = {}

for (const color of colors) {
  for (const alpha of alphas) {
    const [name, hex] = color
    let alphaName = alpha * 100
    alphaName = alphaName === 100 ? 'default' : `${alphaName}`

    status[name] = status[name] ? status[name] : {}
    status[name][alphaName] = tinycolor(hex).setAlpha(alpha).toRgbString()
  }
}

module.exports = status
