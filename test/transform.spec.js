const assert = require('assert')
const { resolve } = require('path')
const parseSketchFile = require('../src/parseSketchFile')
const Transformer = require('../src/transform')

describe('Test transform', () => {
  it('should transform sketch file data correctly', done => {
    parseSketchFile(
      resolve(__dirname, '../assets/demo.sketch')
    ).then(res => {
      const transformer = new Transformer(res.meta, res.pages, {
        savePath: 'tmp',
        ignoreSymbolPage: true,
        foreignSymbols: res.document.foreignSymbols
      })
      const result = transformer.convert()
      assert.equal(
        result.artboards.length,
        1
      )
      assert.equal(
        result.artboards[0].layers.length,
        4
      )
      assert.deepEqual(
        result.artboards[0].layers[0],
        {
          objectID: 'C2E55C0B-4D07-433C-B687-783631565627',
          type: 'symbol',
          name: 'Rect',
          rotation: 0,
          borders: [],
          fills: [],
          shadows: [],
          opacity: 1,
          rect: { width: 174, height: 50, x: 104, y: 124 }
        }
      )
      assert.deepEqual(
        result.artboards[0].layers[1],
        {
          objectID: '1277BCA8-2E07-4B55-9A56-3C2902E394FC',
          type: 'shape',
          name: 'Rectangle',
          rotation: 0,
          borders: [{
            fillType: 'color',
            position: 'outside',
            thickness: 1,
            color:
            {
              r: 0,
              g: 0,
              b: 0,
              a: 1,
              'color-hex': '#000000 100%',
              'argb-hex': '#ff000000',
              'css-rgba': 'rgba(0,0,0,1)',
              'ui-color': '(r:0.00 g:0.00 b:0.00 a:1.00)'
            }
          }],
          fills: [{
            fillType: 'color',
            color:
            {
              r: 255,
              g: 0,
              b: 0,
              a: 1,
              'color-hex': '#FF0000 100%',
              'argb-hex': '#ffFF0000',
              'css-rgba': 'rgba(255,0,0,1)',
              'ui-color': '(r:1.00 g:0.00 b:0.00 a:1.00)'
            }
          }],
          shadows: [],
          opacity: 1,
          rect: { width: 174, height: 50, x: 104, y: 124 },
          radius: 0
        }
      )
      assert.deepEqual(
        result.artboards[0].layers[2],
        {
          objectID: 'AADF9D36-622E-4097-8B33-9780CDF71558',
          type: 'shape',
          name: 'Triangle',
          rotation: 0,
          borders: [{
            fillType: 'color',
            position: 'center',
            thickness: 1,
            color:
            {
              r: 150,
              g: 150,
              b: 150,
              a: 1,
              'color-hex': '#969696 100%',
              'argb-hex': '#ff969696',
              'css-rgba': 'rgba(150,150,150,1)',
              'ui-color': '(r:0.59 g:0.59 b:0.59 a:1.00)'
            }
          }],
          fills: [{
            fillType: 'color',
            color:
            {
              r: 215,
              g: 215,
              b: 215,
              a: 1,
              'color-hex': '#D7D7D7 100%',
              'argb-hex': '#ffD7D7D7',
              'css-rgba': 'rgba(215,215,215,1)',
              'ui-color': '(r:0.85 g:0.85 b:0.85 a:1.00)'
            }
          }],
          shadows: [],
          opacity: 1,
          rect: { width: 61, height: 80, x: 160, y: 231 },
          radius: 0
        }
      )
      done()
    }).catch(done)
  })
})
