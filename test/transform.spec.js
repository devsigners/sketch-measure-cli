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
      assert.strictEqual(
        result.artboards.length,
        1
      )
      assert.strictEqual(
        result.artboards[0].layers.length,
        13
      )
      assert.deepStrictEqual(
        result.artboards[0].layers[0],
        {
          objectID: '2157A837-50BE-445F-9523-443229E95AD0',
          type: 'shape',
          name: 'Group',
          rotation: 0,
          borders: [],
          fills: [],
          shadows: [],
          opacity: 1,
          rect: { width: 201, height: 80, x: 87, y: 171 },
          css: [
            "width: 201px;",
            "height: 80px;"
          ],
          rncss: [
            "width: 201,",
            "height: 80,"
          ]
        }
      )
      assert.deepStrictEqual(
        result.artboards[0].layers[1],
        {
          objectID: 'AADF9D36-622E-4097-8B33-9780CDF71558',
          type: 'shape',
          name: 'both',
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
              "argb-hex": "#ff969696",
              "color-hex": "#969696 100%",
              "css-rgba": "rgba(150,150,150,1)",
              "ui-color": "(r:0.59 g:0.59 b:0.59 a:1.00)"
            }
          }],
          css: [
            "width: 61px;",
            "height: 80px;",
            "background: #D7D7D7;",
            "border: 1px solid #969696;"
          ],
          fills: [{
            fillType: 'color',
            color:
            {
              r: 215,
              g: 215,
              b: 215,
              a: 1,
              "argb-hex": "#ffD7D7D7",
              "color-hex": "#D7D7D7 100%",
              "css-rgba": "rgba(215,215,215,1)",
              "ui-color": "(r:0.85 g:0.85 b:0.85 a:1.00)"
            }
          }],
          shadows: [],
          opacity: 1,
          rect: { width: 61, height: 80, x: 157, y: 171 },
          rncss: [
            "width: 61,",
            "height: 80,",
            "backgroundColor: '#D7D7D7',",
            "borderWidth: 1,",
            "borderColor: '#969696',"
          ]
        }
      )
      assert.deepStrictEqual(
        result.artboards[0].layers[2],
        {
          objectID: 'D7A9F7D6-CFED-4C9A-9EB1-C1131A7F24D0',
          type: 'shape',
          name: 'backgroundcolor',
          rotation: 0,
          borders: [],
          css: [
            "width: 61px;",
            "height: 80px;",
            "background: #D7D7D7;"
          ],
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
          rect: { width: 61, height: 80, x: 227, y: 171 },
          rncss: [
            "width: 61,",
            "height: 80,",
            "backgroundColor: '#D7D7D7',"
          ]
        }
      )
      done()
    }).catch(done)
  })
})
