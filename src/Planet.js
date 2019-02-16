import React from 'react'
import * as THREE from 'three'
import clamp from 'lodash/clamp'
import bv2rgb from 'utils/bv2rgb'
import Point from 'components/Point'
import { withConfigContext } from './Config/Context'
import { withSceneContext } from 'components/Scene'
import flow from 'lodash/flow'
import Label from 'components/Label'
import Sphere from 'components/Sphere'
import Line from 'components/Line'
import astronomy, { METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'

export const COLORINDEX = {
  Mercury: 0,
  Venus: 0.96,
  Earth: 0,
  Mars: 1.73,
  Jupiter: 0.98,
  Saturn: 1.43,
  Uranus: 0.94,
  Neptune: 0,
  Pluto: 0 
}
export const DIAMETER = {
  Mercury: 4878,
  Venus: 12104,
  Earth: 12756,
  Mars: 6794,
  Jupiter: 142984,
  Saturn: 120536,
  Uranus: 51118,
  Neptune: 49532,
  Pluto: 2370
}

class Planet extends React.PureComponent {
  state = {}
  componentDidMount() {
    const { name } = this.props
    this.setState({
      color: bv2rgb(COLORINDEX[name]), 
    })
    this.updatePosition()
  }
  updatePosition(props) {
    const { location, name, date } = props || this.props

    const day = astronomy.DayValue(new Date(date))
    const distance = astronomy[name].DistanceFromEarth(day)
    const hz = astronomy[name].HorizontalCoordinates(day, location)
    const r = distance * METERS_PER_ASTRONOMICAL_UNIT/1000
    const phi = THREE.Math.degToRad(hz.altitude)
    const theta = THREE.Math.degToRad(90 + hz.azimuth)
    const position = new THREE.Vector3(
      r*Math.cos(phi)*Math.sin(theta),
      r*Math.cos(phi)*Math.cos(theta),
      r*Math.sin(phi),
    )
    this.setState({ position })
  }
  componentWillReceiveProps({ frame, scene, ...nextProps }) {
    if(
      this.props.date !== nextProps.date ||
      this.props.location !== nextProps.location
    ) {
      this.updatePosition(nextProps)
    }
  }
  render() {
    const { compassModeEnabled, compassRadius, showPlanetLabel, urlMap, name } = this.props
    const { size, position, color } = this.state
    if(!position) return false
    return (
      <React.Fragment>
        { showPlanetLabel && name &&
            <Label
              position={position}
              color='magenta'
            >
              { name }
            </Label>
        }
        <Point
          size={3}
          color={color}
          position={position}
        />
      </React.Fragment>
    )
  }
}
Planet.defaultProps = {
  name: 'Mercury',
}
export default flow(
  withSceneContext,
  withConfigContext,
)(Planet)
