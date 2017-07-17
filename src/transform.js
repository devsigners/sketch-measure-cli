const {
  toHex,
  convertRGBToHex,
  toPercentage,
  round,
  getSlug
} = require('./utils')

module.exports = convert

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
  const borders = transformBorders(style.borders)
  const fills = transformFills(style.fills)
  const shadows = transformShadows(style.shadows).concat(
    transformShadows(style.innerShadows)
  )
  return {
    borders,
    fills,
    shadows
  }
}

/**
 * Transform layer.style.borders
 * @param  {Array} borders border style list
 * @return {Array}         transformed border style
 */
function transformBorders (borders) {
  if (!borders || !borders.length) return []
  return borders.filter(v => v.isEnabled)
    .map(v => {
      return {
        fillType: FILLTYPE_MAP[v.fillType],
        position: POSITION_MAP[v.position],
        thickness: v.thickness,
        color: transformColor(v.color)
      }
    })
}

/**
 * Transform layer.style.fills
 * @param  {Array} fills fill style list
 * @return {Array}         transformed fill style
 */
function transformFills (fills) {
  if (!fills || !fills.length) return []
  return fills.filter(v => v.isEnabled)
    .map(v => {
      return {
        fillType: FILLTYPE_MAP[v.fillType],
        position: POSITION_MAP[v.position],
        thickness: v.thickness,
        color: transformColor(v.color)
      }
    })
}

/**
 * Transform layer.style.shadows
 * @param  {Array} shadows shadow style list
 * @return {Array}         transformed shadow style
 */
function transformShadows (shadows) {
  if (!shadows || !shadows.length) return []
  return shadows.filter(v => v.isEnabled)
    .map(v => {
      return {
        type: v._class === 'innerShadow' ? 'inner' : 'outer',
        offsetX: v.offsetX,
        offsetY: v.offsetY,
        blurRadius: v.blurRadius,
        spread: v.spread,
        color: transformColor(v.color)
      }
    })
}

/**
 * Transform color
 * @param  {Object} color sketch color object
 * @return {Object}       transformed color object
 */
function transformColor (color) {
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
