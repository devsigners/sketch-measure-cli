#!/usr/bin/env node

const { resolve, basename, extname } = require('path')
const program = require('commander')
const pkg = require('../package.json')
const convert = require('../src')
let debug = () => {}

program
  .version(pkg.version)

program
  .command('convert <sketchFile>')
  .alias('c')
  .description('convert sketch file to static html pages')
  .option('-d, --dest <dir>', 'Dest directory which html pages generate to.')
  .option('-v, --verbose', 'print details when execute commands.')
  .action((sketchFile, options) => {
    const src = resolve(sketchFile)
    const dest = resolve(
      options.dest || basename(sketchFile, extname(sketchFile))
    )
    // load debug module after set process.env.DEBUG
    if (options.verbose) {
      process.env.DEBUG = 'sketch-measure-cli,sketch-measure-core'
      debug = require('debug')('sketch-measure-cli')
    }
    debug('src: %s', dest)
    debug('dest: %s', dest)
    convert(src, dest)
      .then(() => {
        console.log('')
        console.log('  Success!')
        console.log(`  Open file:///${dest.slice(1)}/index.html in browser.`)
        console.log('  And you can start a static server for better experience.')
        console.log('')
      })
      .catch(console.error.bind(console))
  })

program.parse(process.argv)
