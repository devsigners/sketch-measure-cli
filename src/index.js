const { join } = require('path')
const {
  toHex,
  convertRGBToHex,
  toPercentage,
  round,
  getSlug
} = require('./utils')
const parseSketchFile = require('./parseSketchFile')
const generatePage = require('./generateMeasurePage')
const generatePreviewImg = require('./generatePreviewImg')

function convert (meta, pages) {
  const result = prepareDefaultConfig()
  const pagesAndArtboards = meta.pagesAndArtboards
  Object.keys(pagesAndArtboards).forEach(k => {
    const page = pages[k]
    const artboards = pagesAndArtboards[k].artboards
    Object.keys(artboards).forEach(id => {
      const slug = getSlug(page.name, artboards[id].name)
      const pageMeta = {
        pageName: page.name,
        pageObjectID: k,
        name: artboards[id].name,
        slug,
        objectID: id,
        imagePath: `preview/${slug}.png`,
        layers: []
      }
      let artboard
      page.layers.some(l => {
        if (l.do_objectID === id) {
          artboard = l
          return true
        }
      })
      result.artboards.push(convertArtboard(
        artboard,
        pageMeta
      ))
    })
  })
  return result
}

function prepareDefaultConfig () {
  return {
    scale: '1',
    unit: 'px',
    colorFormat: 'color-hex',
    artboards: [],
    slices: [],
    colors: []
  }
}

function convertArtboard (artboard, pageMeta) {
  pageMeta.width = artboard.frame.width
  pageMeta.height = artboard.frame.height
  artboard.layers.forEach(l => {
    pageMeta.layers.push(convertLayer(l))
  })
  return pageMeta
}

const TYPE_MAP = {
  shapeGroup: 'shape'
}
const REVERSED_KEYS = ['name', 'rotation']
function convertLayer (layer) {
  const result = {
    objectID: layer.do_objectID,
    type: TYPE_MAP[layer._class] || layer._class
  }
  REVERSED_KEYS.forEach(k => {
    result[k] = layer[k]
  })
  Object.assign(result, getStyleInfo(layer.style))
  handleFrame(layer, result)
  return result
}

/**
 * 处理 frame
 */
function handleFrame (layer, result) {
  const frame = layer.frame
  result[frame._class] = {
    width: round(frame.width, 1),
    height: round(frame.height, 1),
    x: frame.x,
    y: frame.y
  }
}

/**
 * 处理 style
 */
const FILLTYPE_MAP = {
  '0': 'color'
}
const POSITION_MAP = {
  '0': 'center'
}
function getStyleInfo (style) {
  const borders = style.borders
    .filter(v => v.isEnabled)
    .map(v => {
      return {
        fillType: FILLTYPE_MAP[v.fillType],
        position: POSITION_MAP[v.position],
        thickness: v.thickness,
        color: handleColor(v.color)
      }
    })
  const fills = style.fills
    .filter(v => v.isEnabled)
    .map(v => {
      return {
        fillType: FILLTYPE_MAP[v.fillType],
        position: POSITION_MAP[v.position],
        thickness: v.thickness,
        color: handleColor(v.color)
      }
    })
  
  return {
    borders,
    fills
  }
}
function handleColor (color) {
  const r = ~~(color.red * 255)
  const g = ~~(color.green * 255)
  const b = ~~(color.blue * 255)
  const a = color.alpha
  return {
    r,
    g,
    b,
    a,
    'color-hex': `#${convertRGBToHex(r, g, b)} ${toPercentage(a, 0)}`,
    'argb-hex': `#${toHex(a * 255, 2)}${convertRGBToHex(r, g, b)}`,
    'css-rgba': `rgba(${r},${g},${b},${a})`,
    'ui-color': `(r:${color.red.toFixed(2)} g:${color.green.toFixed(2)} b:${color.blue.toFixed(2)} a:${a.toFixed(2)})`
  }
}

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

process(
  '/Users/creeper/Desktop/Untitled.sketch',
  '/Users/creeper/Desktop/tm'
).catch(e => {
  console.error(e)
})
