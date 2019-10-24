const assert = require('assert')
const { resolve } = require('path')
const parseSketchFile = require('../src/parseSketchFile')

describe('Test parseSketchFile', () => {
  it('should parse sketch file correctly', done => {
    parseSketchFile(
      resolve(__dirname, '../assets/demo.sketch')
    ).then(res => {
      assert.deepStrictEqual(
        Object.keys(res.meta.pagesAndArtboards),
        Object.keys(res.pages)
      )
      delete res.meta.pagesAndArtboards
      assert.deepStrictEqual(
        res.meta,
        {
          commit: '623a23f2c4848acdbb1a38c2689e571eb73eb823',
          version: 112,
          fonts: [
            'PingFangSC-Ultralight',
            'PingFangSC-Medium',
            'PingFangSC-Semibold'
          ],
          compatibilityVersion: 99,
          app: 'com.bohemiancoding.sketch3',
          autosaved: 0,
          variant: 'NONAPPSTORE',
          created:
          {
            commit: '623a23f2c4848acdbb1a38c2689e571eb73eb823',
            appVersion: '52.2',
            build: 67145,
            app: 'com.bohemiancoding.sketch3',
            compatibilityVersion: 99,
            version: 112,
            variant: 'NONAPPSTORE'
          },
          saveHistory: ['NONAPPSTORE.67145'],
          appVersion: '52.2',
          build: 67145
        }
      )
      assert.ok(res.document)
      done()
    }).catch(done)
  })
})
