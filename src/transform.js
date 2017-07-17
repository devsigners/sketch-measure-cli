const { join } = require('path')
const {
  toHex,
  convertRGBToHex,
  toPercentage,
  round,
  getSlug
} = require('./utils')

/**
 * Layer Types.
 * @type {Object}
 */
const TYPE_MAP = {
  text: 'text',
  slice: 'slice',
  symbolInstance: 'symbol',
  shape: 'shape'
}

/**
 * Transform exportable for slices & symbols (has export size)
 * @param  {Object} layer  layer data
 * @param  {Object} result result
 * @param  {Object} extra  extra info
 * @return {Undefined}
 */
function transformExportable (layer, result, extra) {
  const type = result.type
  if (type === TYPE_MAP.slice || (
    type === TYPE_MAP.symbolInstance
    && layer.exportOptions.exportFormats.length
  )) {
    result.exportable = layer.exportOptions.exportFormats.map(v => {
      const prefix = v.prefix || ''
      const suffix = v.suffix || ''
      return {
        name: layer.name,
        format: v.fileFormat,
        scale: v.scale,
        path: prefix + layer.name + suffix + '.' + v.fileFormat
      }
    })
  }
}

/**
 * Transform frame, get position & size
 * @param  {Object} layer  layer data
 * @param  {Object} result object to save transformed result
 * @return {Undefined}
 */
function transformFrame (layer, result) {
  const frame = layer.frame
  result[frame._class] = {
    width: round(frame.width, 1),
    height: round(frame.height, 1),
    x: frame.x,
    y: frame.y
  }
}

/**
 * Transform extra info.
 * @param  {Object} layer  layer data
 * @param  {Object} result object to save transformed result
 * @return {Undefined}
 */
function transformExtraInfo (layer, result) {
  // Set radius
  if (layer.layers) {
    const first = layer.layers[0]
    if (first._class === 'rectangle') {
      result.radius = first.fixedRadius
    } else {
      result.radius = 0
    }
  }
}

/**
 * 处理 style
 */
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

const FILLTYPE_MAP = {
  '0': 'color'
}
const POSITION_MAP = {
  '0': 'center'
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

/**
 * transform artboard.
 * @param  {Object} artboard artboard data
 * @param  {Object} pageMeta page meta
 * @param  {Object} extra    extra info
 * @return {Object}          transformed artboard data.
 */
function transformArtboard (artboard, pageMeta, extra) {
  pageMeta.width = artboard.frame.width
  pageMeta.height = artboard.frame.height
  artboard.layers.forEach(l => {
    pageMeta.layers.push(transformLayer(l, extra))
  })
  return pageMeta
}

/**
 * Get layer type.
 * @param  {Object} layer layer data.
 * @return {String}       layer type.
 */
function getLayerType (layer, extra) {
  if (TYPE_MAP[layer._class]) {
    return TYPE_MAP[layer._class]
  } else if (layer.exportOptions.exportFormats.length) {
    return TYPE_MAP.slice
  }
  return TYPE_MAP.shape
}

const REVERSED_KEYS = ['name', 'rotation']

function transformLayer (layer, extra) {
  const result = {
    objectID: layer.do_objectID,
    type: getLayerType(layer)
  }
  REVERSED_KEYS.forEach(k => {
    result[k] = layer[k]
  })
  if (layer.style) {
    Object.assign(result, getStyleInfo(layer.style))
  }
  transformFrame(layer, result)
  transformExtraInfo(layer, result)
  transformExportable(layer, result, extra)
  return result
}

class Transformer {
  constructor (meta, pages, extra) {
    this.meta = meta
    this.pages = pages
    this.init(extra)
  }
  init ({ savePath }) {
    this.savePath = savePath
    this.assetsPath = join(savePath, 'assets')
    // hardcode some values.
    this.result = {
      scale: '1',
      unit: 'px',
      colorFormat: 'color-hex',
      artboards: [],
      slices: [],
      colors: []
    }
  }
  convert () {
    const pagesAndArtboards = this.meta.pagesAndArtboards
    const pages = this.pages
    const result = this.result
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
        result.artboards.push(transformArtboard(
          artboard,
          pageMeta,
          {
            savePath: this.savePath,
            assetsPath: this.assetsPath
          }
        ))
      })
    })
    return result
  }
}

module.exports = Transformer
