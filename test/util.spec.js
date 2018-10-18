const assert = require('assert')
const {
  toHex,
  convertRGBToHex,
  toPercentage,
  round,
  getSlug,
  promisedExec
} = require('../src/utils')

describe('Test utils', () => {
  it('toHex should convert number to hex correctly', () => {
    assert.strictEqual(toHex(255), 'ff')
    assert.strictEqual(toHex(1, 2), '01')
    try {
      toHex()
    } catch (e) {
      assert(e.message, 'First argument should be a number.')
    }
  })
  it('toPercentage should convert number to percentage correctly', () => {
    assert.strictEqual(toPercentage(1.2), '120.00%')
    assert.strictEqual(toPercentage(0.078, 1), '7.8%')
    try {
      toPercentage()
    } catch (e) {
      assert(e)
    }
  })
  it('round should enhance Math.round correctly', () => {
    assert(Number.isNaN(round()))
    assert.strictEqual(round(1.2345, 3), 1.235)
    assert.strictEqual(round(1.2), 1)
    assert.strictEqual(round(2.5, 0), 3)
  })
  it('convertRGBToHex should convert to rgb color correctly', () => {
    assert.strictEqual(convertRGBToHex(0, 0, 0), '000000')
    assert.strictEqual(convertRGBToHex(255, 10, 9), 'FF0A09')
    try {
      convertRGBToHex(255, 10)
    } catch (e) {
      assert(e.message, 'First argument should be a number.')
    }
  })
  it('getSlug should convert string to slug correctly', () => {
    assert.strictEqual(getSlug('a', 'B'), 'a-b')
    assert.strictEqual(getSlug('one Two', 'Three four'), 'one-two-three-four')
    try {
      getSlug(0)
    } catch (e) {
      assert(e.message, 'Arguments should be non-empty string.')
    }
  })
  it('promisedExec should exec cmd asynchronously', done => {
    promisedExec(`ls ${__dirname}`).then(res => {
      assert(res)
      done()
    }, err => {
      done(err)
    })
  })
})
