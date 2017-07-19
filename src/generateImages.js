const { promisedExec } = require('./utils')

// sketchtool path
const ROOT = '/Applications/Sketch.app/Contents/Resources/sketchtool'

module.exports = {
  rename,
  generateSliceImages,
  generatePreviewImages
}

const RE_IMG = /Exported\s([^\n]+)@2x.png\n?/g

// We should prevent to duplicate image with save name.
function getFilesFromMsg (msg) {
  const files = {}
  let match
  while ((match = RE_IMG.exec(msg)) != null) {
    files[match[1]] = true
  }
  return Object.keys(files)
}

function install () {
  return promisedExec(`bash ${ROOT}/install.sh`)
}

function generatePreviewImages (file, dest, scale) {
  return promisedExec(`sketchtool -v`).catch(() => {
    return install()
  }).then(() => {
    return promisedExec(`sketchtool export artboards ${escape(file)} --output=${escape(dest)} --format="png" --scales="${scale || '2.0'}"`).then(msg => {
      return getFilesFromMsg(msg)
    })
  })
}

function generateSliceImages (file, dest, scale) {
  return promisedExec(`sketchtool -v`).catch(() => {
    return install()
  }).then(() => {
    return promisedExec(`sketchtool export slices ${escape(file)} --output=${escape(dest)} --format="png" --scales="${scale || '2.0'}"`).then(msg => {
      return getFilesFromMsg(msg)
    })
  })
}

function rename (src, dest) {
  return promisedExec(`mv ${escape(src)} ${escape(dest)}`)
}

function escape (url) {
  return url && url.replace(/\s/g, `\\ `)
}
