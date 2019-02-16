import React from 'react'
import * as THREE from 'three'
import clamp from 'lodash/clamp'
import bv2rgb from 'utils/bv2rgb'
import Point from 'components/Point'
import { withSceneContext } from 'components/Scene'
import { withConfigContext } from './Config/Context'
import flow from 'lodash/flow'
import stars from './data/star.json'
import constellations from './data/constellation.json'
import astronomy, { Star, METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'
import uniq from 'lodash/uniq'

const starMap = stars.reduce((acc, star) => {
  acc[star.id] = star
  return acc
}, {})

const vertexShader = `
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 1.0;
    gl_Position = projectionMatrix * mvPosition;
  }
`
const fragmentShader = `
  void main() {
    gl_FragColor = vec4(0.3, 0.3, 0.3, 1.0);
  }
`
const material = new THREE.ShaderMaterial( {
  vertexShader,
  fragmentShader,
})

class Constellations extends React.PureComponent {
  _lines = []
  componentDidMount() {
    this.updatePosition()
  }
  updatePosition(props) {
    const { compassRadius, date, location, scene } = props || this.props
    const day = astronomy.DayValue(new Date(date))

    scene.remove(this._line)

    const stars = uniq(constellations.reduce((acc, node) => acc.concat(node.stars), []))
    const positionMap = {}
    for(let id of stars) {
      const r = starMap[id]
      if(!r) {
        // console.log('notfound:', id)
        continue
      }
      const star = new Star(
        compassRadius * r.x,
        compassRadius * r.y, 
        compassRadius * r.z
      )
      const distance = star.DistanceFromEarth(day)
      const hz = star.HorizontalCoordinates(day, location)
      const R = distance * compassRadius
      const phi = THREE.Math.degToRad(hz.altitude)
      const theta = THREE.Math.degToRad(90 + hz.azimuth)
      positionMap[id] = new THREE.Vector3(
        R*Math.cos(phi)*Math.sin(theta),
        R*Math.cos(phi)*Math.cos(theta),
        R*Math.sin(phi)
      )
    }

    const positions = []
    for(let constellation of constellations) {
      const ps = []
      for(let i=0; i<constellation.stars.length-1; i++) {
        const p0 = positionMap[constellation.stars[i]]
        const p1 = positionMap[constellation.stars[i+1]]
        if(!p0 || !p1) continue
        ps.push(p0.x, p0.y, p0.z)
        ps.push(p1.x, p1.y, p1.z)
      }
      positions.push(...ps)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
    this._line = new THREE.LineSegments(geometry, material)
    scene.add(this._line)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._line)
  }
  componentWillReceiveProps(nextProps) {
    if(
      this.props.date !== nextProps.date ||
      this.props.location !== nextProps.location
    ) {
      this.updatePosition(nextProps)
    }
  }
  render() {
    return false
  }
}

export default flow(
  withSceneContext,
  withConfigContext,
)(Constellations)
