const { createReadStream, createWriteStream, readFileSync } = require('fs')
const { resolve } = require('path')
const { Readable } = require('stream')
const mkdirp = require('mkdirp')

module.exports = generate

function copy (src, dest) {
  const writer = createWriteStream(dest)
  return new Promise((resolve, reject) => {
    writer.on('close', resolve)
    writer.on('error', reject)
    let reader
    if (Buffer.isBuffer(src)) {
      reader = new Readable()
      reader.push(src)
      reader.push(null) // End the stream
    } else {
      reader = createReadStream(src)
    }
    reader.pipe(writer)
  })
}

function copyAssets (dest) {
  const files = [
    'index.css',
    'index.js',
    'jQuery.js',
    'normalize.css'
  ]
  const urls = files.map(v => resolve(__dirname, '../assets', v))
  try {
    mkdirp.sync(resolve(dest, 'preview'))
  } catch (e) {
    return Promise.reject(e)
  }
  return Promise.all(
    urls.map((v, i) => copy(v, resolve(dest, files[i])))
  )
}

let INDEX_HTML
function generateIndexHtml (data, dest) {
  if (!INDEX_HTML) {
    INDEX_HTML = readFileSync(resolve(__dirname, '../assets/index.html'), {
      encoding: 'utf8'
    }).toString()
  }
  const html = INDEX_HTML.replace(/__data__/, JSON.stringify(data, null, 2))
  return copy(
    Buffer.from(html, 'utf8'),
    dest
  )
}

function generate (data, dest) {
  return copyAssets(dest).then(() => {
    return generateIndexHtml(
      data,
      resolve(dest, 'index.html')
    )
  })
}
