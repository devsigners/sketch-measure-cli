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
          commit: 'd5cff89adfb6ffc45ca7b7d58d65cada3f63f39a',
          version: 95,
          fonts: [],
          compatibilityVersion: 93,
          app: 'com.bohemiancoding.sketch3',
          autosaved: 0,
          variant: 'NONAPPSTORE',
          created:
          {
            commit: 'd5cff89adfb6ffc45ca7b7d58d65cada3f63f39a',
            appVersion: '47.1',
            build: 45422,
            app: 'com.bohemiancoding.sketch3',
            compatibilityVersion: 93,
            version: 95,
            variant: 'NONAPPSTORE'
          },
          saveHistory: ['NONAPPSTORE.45422'],
          appVersion: '47.1',
          build: 45422
        }
      )
      assert.ok(res.document)
      done()
    }).catch(done)
  })
})
