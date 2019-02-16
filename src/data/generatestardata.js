import { csvParse } from 'd3-dsv'
import fs from 'fs'
import pify from 'pify'
import uniq from 'lodash/uniq'
import { resolve } from 'path'

;(async() => {
  // constellation
  let starids = []
  {
    const ret = []
    const data = await pify(fs.readFile)(resolve(__dirname, 'ConstellationLines.dat'), 'utf8')
    const rows = data.split(/\n+/).filter(line => line[0] !== '#' && line.length > 0)
    for(let row of rows) {
      const d = row.split(/\s+/)
      ret.push({
        name: d[0],
        stars: d.slice(2).map(i => parseInt(i))
      })
    }
    starids = uniq(ret.reduce((acc, node) => acc.concat(node.stars), []))
    console.log('constellations:', ret.length)
    await pify(fs.writeFile)(resolve(__dirname, 'constellation.json'), JSON.stringify(ret))
  }

  //
  {
    const data = await pify(fs.readFile)(resolve(__dirname, 'hygdata_v3.csv'), 'utf8')
    const all = csvParse(data)
    const rows = all.filter(star => 
      // stars that is referred on constellation should be included
      starids.indexOf(parseInt(star.hr)) >= 0 ||
      // without Sol
      (star.proper !== 'Sol' && parseFloat(star.mag) <= 7))
    const ret = []
    for(let row of rows) {
      const star = {}
      star.id = parseInt(row.hr)
      star.x =  parseFloat(row.x)
      star.y = parseFloat(row.y)
      star.z = parseFloat(row.z)
      star.c = parseFloat(row.ci)
      star.m = parseFloat(row.mag)
      if(row.proper) star.n = row.proper
      ret.push(star)
    }
    console.log('stars:', ret.length, 'of', all.length)
    await pify(fs.writeFile)(resolve(__dirname, 'star.json'), JSON.stringify(ret))
  }
})()
