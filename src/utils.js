const { exec } = require('child_process')

function toHex (num, minLength) {
  let hex = num.toString(16)
  if (minLength && hex.length < minLength) {
    hex = Array.apply(null, {
      length: minLength - hex.length
    }).map(v => '0').join('') + hex
  }
  return hex
}

exports.toHex = toHex

function mathRound (num, precision) {
  num = +num
  if (Number.isNaN(num)) return NaN
  precision = +precision
  if (Number.isNaN(precision)) precision = 0

  return Number(
    '' + Math.round(
      num * Math.pow(10, precision)
    ) + 'e-' + precision
  )
}

exports.round = mathRound

exports.convertRGBToHex = function convertRGBToHex (r, g, b) {
  return (toHex(r, 2) + toHex(g, 2) + toHex(b, 2)).toUpperCase()
}

exports.toPercentage = function toPercentage (num, precision) {
  if (typeof precision !== 'number') {
    precision = 2
  }
  return (num * 100).toFixed(precision) + '%'
}

const slugRe = /(\S+)\s+/g
function getSlug (pageName, artboardName) {
  let pn = pageName.replace(slugRe, (match, capture) => {
    return capture + '-'
  })
  let an = artboardName.replace(slugRe, (match, capture) => {
    return capture + '-'
  })
  return (pn + '-' + an).toLowerCase()
}

exports.getSlug = getSlug

exports.promisedExec = function promisedExec (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      err ? reject(err) : resolve(stdout)
    })
  })
}
