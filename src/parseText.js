const {
  parseBuffer,
  unarchivePlist,
  simplifyPlist
} = require('./deps/decodeUtils')

function decodeText (archived) {
  const buffer = Buffer.from(archived._archive, 'base64')
  const plist = parseBuffer(buffer)[0]
  const unarchived = unarchivePlist(plist)
  const simplified = simplifyPlist(unarchived)
  return simplified
}

function parseText (layer) {
  const decodedTextAttributes = decodeText(layer.attributedString.archivedAttributedString)
  const textStyle = new TextStyle(layer)
  const text = decodedTextAttributes.NSString

  const res = {
    content: text
  }
  // Text is split to several blocks.
  if (decodedTextAttributes.NSAttributeInfo) {
    const subTextStyles = decodedTextAttributes.NSAttributeInfo['NS.data']
    const subTexts = []
    for (let i = 0, s = 0, l = subTextStyles.length / 2; i < l; i++) {
      const charCount = subTextStyles[i * 2]
      const styleIndex = subTextStyles[i * 2 + 1]
      subTexts.push({
        content: text.slice(s, s + charCount),
        style: textStyle.getTextStyle(styleIndex)
      })
      s += charCount
    }
    // NOTE: In this case, we cannot to calculate every blocks position info,
    // and we just keep only first block.
    Object.assign(res, subTexts[0].style)
  } else {
    const style = textStyle.getTextStyle()
    Object.assign(res, style)
  }
  return res
}

class TextStyle {
  constructor (layer) {
    this.layer = layer
    this.textStyle = layer.style.textStyle
  }
  _getStyle (attributes) {
    let {
      MSAttributedStringFontAttribute,
      NSColor,
      NSKern,
      NSParagraphStyle
    } = attributes
    // Prevent access error.
    if (!NSParagraphStyle) {
      NSParagraphStyle = {}
    }

    const fontSize = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
    const fontFace = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute
    // Default to left
    let textAlign = 'left'
    switch (NSParagraphStyle.NSAlignment) {
      case 1: {
        textAlign = 'left'
        break
      }
      case 2: {
        textAlign = 'center'
        break
      }
      case 3: {
        textAlign = 'right'
        break
      }
      case 4: {
        textAlign = 'justify'
        break
      }
    }
    let lineHeight = NSParagraphStyle.NSMaxLineHeight

    const style = {
      color: this.decodeColor(NSColor),
      fontSize,
      fontFace,
      textAlign,
      lineHeight: lineHeight || 1.4 * fontSize,
      letterSpacing: NSKern == null ? 0 : NSKern
    }

    return style
  }

  // get style from textStyle.encodedAttributes
  getParagraphStyle () {
    const {
      MSAttributedStringFontAttribute,
      NSColor,
      NSKern,
      NSParagraphStyle
    } = this.textStyle.encodedAttributes

    const fontAttribute = decodeText(MSAttributedStringFontAttribute)
    const paragraphStyle = decodeText(NSParagraphStyle)

    return this._getStyle({
      MSAttributedStringFontAttribute: fontAttribute,
      NSColor,
      NSKern,
      NSParagraphStyle: paragraphStyle
    })
  }

  getTextStyle (styleIndex = null) {
    const decodedTextAttributes = decodeText(this.layer.attributedString.archivedAttributedString)
    const { NSAttributes } = decodedTextAttributes

    // has single subText: NSAttributes is an object
    if (styleIndex === null) {
      return this._getStyle(NSAttributes)
    }

    // has many subText: NSAttributes['NS.objects'] is an array of attribute
    const textAttribute = NSAttributes['NS.objects'][styleIndex]
    return this._getStyle(textAttribute)
  }

  decodeColor (NSColor) {
    if (!NSColor || (!NSColor.NSComponents && !NSColor.NSRGB)) {
      return {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1
      }
    }
    let colors
    if (NSColor.NSComponents) {
      colors = NSColor.NSComponents.toString('ascii').split(' ')
    } else {
      // remove \u0000
      const re = new RegExp(`\u0000`, 'g')
      colors = NSColor.NSRGB.toString('ascii').replace(re, '').split(' ')
    }
    const [red, green, blue, alpha] = colors
    return {
      red: +red,
      green: +green,
      blue: +blue,
      alpha: alpha == null ? 1 : +alpha
    }
  }
}

module.exports = parseText
