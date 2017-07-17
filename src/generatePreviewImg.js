const { exec } = require('child_process')

const ROOT = '/Applications/Sketch.app/Contents/Resources/sketchtool'

exports = module.exports = generatePreviewImg
exports.rename = rename

const RE_IMG = /Exported\s([^\n]+)@2x.png\n?/g

function getFilesFromMsg (msg) {
  const files = []
  let match
  while ((match = RE_IMG.exec(msg)) != null) {
    files.push(match[1])
  }
  return files
}

function promisedExec (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      err ? reject(err) : resolve(stdout)
    })
  })
}

function install () {
  return promisedExec(`bash ${ROOT}/install.sh`)
}

function generatePreviewImg (file, dest) {
  return promisedExec(`sketchtool -v`).catch(() => {
    return install()
  }).then(() => {
    return promisedExec(`sketchtool export artboards ${file} --output=${dest} --format="png" --scales="2.0"`).then(msg => {
      return getFilesFromMsg(msg)
    })
  })
}

function rename (src, dest) {
  return promisedExec(`mv ${
    src.replace(/\s/g, `\\ `)
  } ${
    dest.replace(/\s/g, `\\ `)
  }`)
}
