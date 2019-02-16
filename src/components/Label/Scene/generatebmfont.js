import loadFont from 'load-bmfont'
import pify from 'pify'
import path from 'path'
import fs from 'fs'

const name = process.argv[2]
if(!name) {
  console.error('no name specified.')
  process.exit(1)
}

;(async () => {
  const buffer = await pify(fs.readFile)(path.resolve(__dirname, `${name}.fnt`))
  const font = await pify(loadFont)(path.resolve(__dirname, `${name}.fnt`))
  await pify(fs.writeFile)(path.resolve(__dirname, `${name}.json`), JSON.stringify(font))
})()
