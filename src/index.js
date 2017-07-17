const { join } = require('path')
const convert = require('./transform')
const parseSketchFile = require('./parseSketchFile')
const generatePage = require('./generateMeasurePage')
const generatePreviewImg = require('./generatePreviewImg')

module.exports = process

function process (sketchFile, dest) {
  const NAME_MAP = {}
  return parseSketchFile(sketchFile)
    .then(data => {
      const processedData = convert(data.meta, data.pages)
      processedData.artboards.forEach(artboard => {
        NAME_MAP[artboard.name] = artboard.slug
      })
      return generatePage(processedData, dest)
    })
    .then(() => {
      return generatePreviewImg(sketchFile, join(dest, 'preview'))
    })
    .then(images => {
      return Promise.all(
        images.map(name => {
          const correctName = NAME_MAP[name]
          return generatePreviewImg.rename(
            join(dest, `preview/${name}@2x.png`),
            join(dest, `preview/${correctName}.png`)
          )
        })
      )
    })
}
