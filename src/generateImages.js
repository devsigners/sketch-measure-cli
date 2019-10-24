const { promisedExec } = require('./utils')

// sketchtool path
const sketchtool
= '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool'

module.exports = {
  rename,
  generateSliceImages,
  generatePreviewImages
}

const RE_IMG = /Exported\s([^\n]+)@2x.png\n?/g

// We should prevent to duplicate image with save name.
function getFilesFromMsg(msg) {
  const files = {}
  let match
  while ((match = RE_IMG.exec(msg)) != null) {
    files[match[1]] = true
  }
  return Object.keys(files)
}
// sketch removed 'install.sh' From v49
// function install () {
//   return promisedExec(`${ROOT}/install.sh`)
// }

function generatePreviewImages(file, dest, scale) {
  return promisedExec(`${sketchtool} -v`).then(() => {
    return promisedExec(`${sketchtool} export artboards ${escape(file)} --output=${escape(dest)} --format='png' --use-id-for-name=YES --scales='${scale || '2.0'}'`).then(
      msg => {
        return getFilesFromMsg(msg)
      }
    )
  })
}

function generateSliceImages(file, dest, scale) {
  return promisedExec(`${sketchtool} -v`).then(() => {
    return promisedExec(`${sketchtool} export slices ${escape(file)} --output=${escape(dest)} --format='png' --scales='${scale || '2.0'}'`).then(
      msg => {
        return getFilesFromMsg(msg)
      }
    )
  })
}

function rename(src, dest) {
  return promisedExec(`mv ${escape(src)} ${escape(dest)}`)
}

function escape(url) {
  // Wrap with quotes, so space, parenthese and other special characters
  // wont interrupt cli.
  return `"${url}"`
}
