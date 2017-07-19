const { join } = require('path')
const {
  toHex,
  convertRGBToHex,
  toPercentage,
  round,
  getSlug
} = require('./utils')
const parseText = require('./parseText')

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
 * @return {Undefined}
 */
function transformExportable (layer, result) {
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
    if (first && first._class === 'rectangle') {
      result.radius = first.fixedRadius
    } else {
      result.radius = 0
    }
  }
}

/**
 * Transform main style info: border/shadow/fill/opacity
 * @param  {Object} layer  layer
 * @param  {Object} result result
 * @return {Undefined}
 */
function transformStyle (layer, result) {
  const style = layer.style
  let opacity
  if (style) {
    result.borders = transformBorders(style.borders)
    result.fills = transformFills(style.fills)
    result.shadows = transformShadows(style.shadows).concat(
      transformShadows(style.innerShadows)
    )
    opacity = style.contextSettings && style.contextSettings.opacity
  }
  if (opacity == null && result.type !== 'slice') {
    opacity = 1
  }
  result.opacity = opacity
}

const FILL_TYPES = ['color', 'gradient']
const BORDER_POSITIONS = ['center', 'inside', 'outside']
const GRADIENT_TYPES = ['linear', 'radial', 'angular']
/**
 * Transform layer.style.borders
 * @param  {Array} borders border style list
 * @return {Array}         transformed border style
 */
function transformBorders (borders) {
  if (!borders || !borders.length) return []
  return borders.filter(v => v.isEnabled)
    .map(v => {
      const fillType = FILL_TYPES[v.fillType]
      const borderData = {
        fillType,
        position: BORDER_POSITIONS[v.position],
        thickness: v.thickness
      }
      if (fillType === 'color') {
        borderData.color = transformColor(v.color)
      } else if (fillType === 'gradient') {
        borderData.gradient = transformGradient(v.gradient)
      }
      return borderData
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
      const fillType = FILL_TYPES[v.fillType]
      const fillData = {
        fillType
      }
      if (fillType === 'color') {
        fillData.color = transformColor(v.color)
      } else if (fillType === 'gradient') {
        fillData.gradient = transformGradient(v.gradient)
      }
      return fillData
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
  if (!color) return null
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

function transformGradient (gradient) {
  const stops = gradient.stops.map(stop => {
    return {
      color: transformColor(stop.color),
      position: stop.position
    }
  })
  const data = {
    type: GRADIENT_TYPES[gradient.gradientType],
    colorStops: stops,
    from: transformPosition(gradient.from),
    to: transformPosition(gradient.to)
  }
  return data
}

function transformPosition (position) {
  const parts = position.slice(1, -1).split(/,\s*/)
  return {
    x: +parts[0],
    y: +parts[1]
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
  // Set extra.layers, give other transform* functions a way to operate layers.
  extra.layers = pageMeta.layers
  artboard.layers.forEach(l => {
    const layer = transformLayer(l, extra)
    pageMeta.layers.push(layer)
    if (layer._appendLayers && layer._appendLayers.length) {
      pageMeta.layers.push(...layer._appendLayers)
      delete layer._appendLayers
    }
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
  transformStyle(layer, result)
  transformFrame(layer, result)
  transformExtraInfo(layer, result)
  transformExportable(layer, result)
  if (result.type === 'symbol') {
    result._appendLayers = handleSymbol(layer, result, Object.assign({}, extra, {
      symbolMasterLayer: extra.symbols[layer.symbolID]
    }))
  } else if (result.type === 'text') {
    handleText(layer, result)
  }
  return result
}

/**
 * If layer's type is symbol, we should special handle it:
 * 1. Overwrite objectID.
 * 2. Append symbol's content layer.
 * @param  {Object} layer  layer
 * @param  {Object} result result data
 * @param  {Object} extra  extra info
 * @return {Array}         layers should append
 */
function handleSymbol (layer, result, extra) {
  const symbolMasterLayer = extra.symbolMasterLayer
  const symbolObjectID = symbolMasterLayer.do_objectID
  // Overwrite id.
  result.objectID = symbolObjectID

  return symbolMasterLayer.layers.map(l => {
    const transformedLayer = transformLayer(l, extra)
    transformedLayer.rect.x += result.rect.x
    transformedLayer.rect.y += result.rect.y
    return transformedLayer
  })
}

function handleText (layer, result) {
  if (result.type !== 'text') return
  const textInfo = parseText(layer, result)
  // If fills exists, we should not overwrite color.
  if (!layer.style.fills) {
    result.color = transformColor(textInfo.color)
  }
  delete textInfo.color
  Object.assign(result, textInfo)
}

class Transformer {
  constructor (meta, pages, { savePath, ignoreSymbolPage }) {
    this.meta = meta
    this.pages = pages
    this.savePath = savePath
    this.assetsPath = join(savePath, 'assets')
    this.ignoreSymbolPage = ignoreSymbolPage
    // hardcode some values.
    this.result = {
      scale: '1',
      unit: 'px',
      colorFormat: 'color-hex',
      artboards: [],
      slices: [],
      colors: []
    }
    this._symbolPages = {}
    Object.keys(meta.pagesAndArtboards).forEach(k => {
      const page = pages[k]
      if (this.isSymbolPage(page)) {
        this._symbolPages[k] = page
      }
    })
  }
  convert () {
    const pagesAndArtboards = this.meta.pagesAndArtboards
    const pages = this.pages
    const result = this.result
    const symbols = Object.keys(this._symbolPages).reduce((acc, val) => {
      this._symbolPages[val].layers.forEach(v => {
        acc[v.symbolID] = v
      })
      return acc
    }, {})
    Object.keys(pagesAndArtboards).forEach(k => {
      const page = pages[k]
      if (this.ignoreSymbolPage && this._symbolPages[k]) {
        return
      }
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
            assetsPath: this.assetsPath,
            symbols
          }
        ))
      })
    })
    return result
  }
  isSymbolPage (page) {
    return page.layers.every(layer => layer._class === 'symbolMaster' || layer.symbolID)
  }
}

module.exports = Transformer
