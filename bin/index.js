#!/usr/bin/env node

const { resolve } = require('path')
const program = require('commander')
const pkg = require('../package.json')
const convert = require('../src')

program
  .version(pkg.version)

program
  .command('convert <sketchFile>')
  .description('convert sketch file to static html pages')
  .option('-d, --dest <dir>', 'Dest directory which html pages generate to.')
  .option('-v, --verbose', 'print details when execute commands.')
  .action((sketchFile, options) => {
    const src = resolve(sketchFile)
    const dest = resolve(options.dest || '.')
    if (options.verbose) {
      console.log(`src: ${src}, dest: ${dest}`)
    }
    convert(src, dest)
      .then(() => {
        console.log('')
        console.log('Success!')
        console.log(`Open file:\\\\\\${dest.slice(1)}/index.html in browser.`)
        console.log(`And you can start a static server for better experience.`)
        console.log('')
      })
      .catch(console.error.bind(console))
  })

program.parse(process.argv)
