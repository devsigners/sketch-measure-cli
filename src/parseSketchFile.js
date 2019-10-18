const { createReadStream, readFile } = require('fs')
const unzip = require('unzipper')
const tempfile = require('tempfile')
const pReadFile = src => {
  return new Promise((resolve, reject) => {
    readFile(src, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

module.exports = parseSketchFile

function extractZipFile(src, dest, cb) {
  const writer = unzip.Extract({ path: dest })
  writer.on('close', cb)
  writer.on('error', cb)
  createReadStream(src).pipe(writer)
}

function parseJSONFile(src) {
  return pReadFile(src).then(v => JSON.parse(v))
}

function parseSketchFile(src) {
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
        Promise.all([
          parseJSONFile(`${dest}/meta.json`),
          parseJSONFile(`${dest}/document.json`)
        ]).then(([meta, document]) => {
          res.meta = meta
          res.document = document
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
