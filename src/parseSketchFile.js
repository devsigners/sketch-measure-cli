const { createReadStream, readFile } = require('fs')
const util = require('util')
const unzip = require('unzip')
const tempfile = require('tempfile')
const pReadFile = util.promisify(readFile)

module.exports = parseSketchFile

function extractZipFile (src, dest, cb) {
  const writer = unzip.Extract({ path: dest })
  writer.on('close', cb)
  writer.on('error', cb)
  createReadStream(src).pipe(writer)
}

function parseJSONFile (src) {
  return pReadFile(src).then(v => JSON.parse(v))
}

function parseSketchFile (src) {
  const dest = tempfile()
  return new Promise((resolve, reject) => {
    extractZipFile(src, dest, err => {
      if (err) {
        return reject(err)
      }
      const res = {
        path: dest
      }
      resolve(
        parseJSONFile(`${dest}/meta.json`).then(meta => {
          res.meta = meta
          res.pages = {}
          const ids = Object.keys(meta.pagesAndArtboards)
          return Promise.all(
            ids.map(id => parseJSONFile(`${dest}/pages/${id}.json`))
          ).then(pages => {
            res.pages = pages.reduce((acc, val, i) => {
              acc[ids[i]] = val
              return acc
            }, {})
            return res
          })
        })
      )
    })
  })
}
