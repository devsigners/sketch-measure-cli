const assert = require('assert')
const { resolve } = require('path')
const parseSketchFile = require('../src/parseSketchFile')

describe('Test parseSketchFile', () => {
  it('should parse sketch file correctly', done => {
    parseSketchFile(
      resolve(__dirname, '../assets/test.sketch')
    ).then(res => {
      assert.deepEqual(
        Object.keys(res.meta.pagesAndArtboards),
        Object.keys(res.pages)
      )
      delete res.meta.pagesAndArtboards
      assert.deepEqual(
        res.meta,
        {
          commit: '4e7e2f5d7940a711b59f89190b5b7e3029f050f5',
          version: 103,
          fonts: ["PingFangSC-Regular"],
          compatibilityVersion: 99,
          app: 'com.bohemiancoding.sketch3',
          autosaved: 0,
          variant: 'NONAPPSTORE',
          created:
          {
            commit: '4e7e2f5d7940a711b59f89190b5b7e3029f050f5',
            appVersion: '50.2',
            build: 55047,
            app: 'com.bohemiancoding.sketch3',
            compatibilityVersion: 99,
            version: 103,
            variant: 'NONAPPSTORE'
          },
          saveHistory: ['NONAPPSTORE.55047'],
          appVersion: '50.2',
          build: 55047
        }
      )
      assert.ok(res.document)
      done()
    }).catch(done)
  })
})
