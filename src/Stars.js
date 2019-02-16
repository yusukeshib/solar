import React from 'react'
import * as THREE from 'three'
import clamp from 'lodash/clamp'
import bv2rgb from 'utils/bv2rgb'
import Point from 'components/Point'
import Label from 'components/Label'
import { withSceneContext } from 'components/Scene'
import { withConfigContext } from './Config/Context'
import flow from 'lodash/flow'
import stars from './data/star.json'
import astronomy, { Star, METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'
import loadTexture from 'components/texture'
import starMap from 'assets/star.png'

const MAX_MAG = 2
const MIN_MAG = -10

class Stars extends React.PureComponent {
  state = {
    labeledStars: []
  }
  async componentDidMount() {
    this.sprite = await loadTexture(starMap)
    this.updatePosition()
  }
  updatePosition(props) {
    const { compassRadius, visibleStarMagnitude, date, location, scene } = props || this.props

    scene.remove(this._points)
    this.setState({ labeledStars: [] })

    const vertices = []
    const labeledStars = []

    const day = astronomy.DayValue(new Date(date))
    const visibleStars = stars.filter(star => star.m <= visibleStarMagnitude)
    const geometry = new THREE.BufferGeometry()
    for(let r of visibleStars) {
      const luminosity = clamp((MAX_MAG-MIN_MAG)-(parseFloat(r.m)-MIN_MAG),0,5).toFixed(2)
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
      const position = new THREE.Vector3(
        R*Math.cos(phi)*Math.sin(theta),
        R*Math.cos(phi)*Math.cos(theta),
        R*Math.sin(phi)
      )
      vertices.push(
        position.x,
        position.y,
        position.z
      )
      if(r.n && r.m < 1) {
        labeledStars.push({
          id: r.id,
          name: r.n,
          position,
          m: r.m
        })
      }
    }

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
    const material = new THREE.PointsMaterial({
      size: 5,
      sizeAttenuation: false,
      map: this.sprite,
      alphaTest: 0.5,
      transparent: true
    })
    material.color.setHSL(1.0, 1.0, 1.0)
    this._points = new THREE.Points( geometry, material )

    scene.add(this._points)
    this.setState({ labeledStars })
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._points)
  }
  componentWillReceiveProps(nextProps) {
    if(
      this.props. visibleStarMagnitude !== nextProps. visibleStarMagnitude ||
      this.props.date !== nextProps.date ||
      this.props.location !== nextProps.location
    ) {
      this.updatePosition(nextProps)
    }
  }
  render() {
    const { showLabel, compassModeEnabled, showStarLabel } = this.props
    const { labeledStars } = this.state
    return (
      <React.Fragment>
        { !compassModeEnabled && showLabel && showStarLabel && labeledStars.map(({ id, position, name }, i) => (
          <Label
            key={id}
            color='white'
            position={position}
          >
            { name }
          </Label>
        ))
        }
      </React.Fragment>
    )
  }
}

export default flow(
  withSceneContext,
  withConfigContext,
)(Stars)
