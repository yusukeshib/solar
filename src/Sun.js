import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import Sphere from 'components/Sphere'
import Label from 'components/Label'
import Line from 'components/Line'
import PointLight from 'components/PointLight'
import { withConfigContext } from './Config/Context'
import flow from 'lodash/flow'
import astronomy, { METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'

class Sun extends React.PureComponent {
  state = {}
  componentDidMount() {
    this.updatePosition()
  }
  updatePosition(props) {
    const { location, date } = props || this.props

    const day = astronomy.DayValue(new Date(date))
    const distance = astronomy.Sun.DistanceFromEarth(day)
    const hz = astronomy.Sun.HorizontalCoordinates(day, location)
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
  componentWillReceiveProps(nextProps) {
    if(
      this.props.date !== nextProps.date ||
      this.props.location !== nextProps.location
    ) {
      this.updatePosition(nextProps)
    }
  }
  render() {
    const { compassModeEnabled, compassRadius, showPlanetLabel } = this.props
    const { position } = this.state
    if(!position) return false
    const compassPosition = position.clone().normalize().multiplyScalar(compassRadius)
    return (
      <React.Fragment>
        { showPlanetLabel && 
            <Label color='yellow' position={position}>Sun</Label>
        }
        <Sphere
          radius={696000}
          position={position}
          color={0xffff00}
          type='basic'
        />
        <PointLight
          intensity={2.5}
          color={0xffffff}
          position={position}
        />
        { compassModeEnabled &&
            <React.Fragment>
              <Label color='yellow' position={compassPosition}>Sun</Label>
              <Sphere
                radius={15000}
                position={compassPosition}
                color={0xffff00}
                type='basic'
              />
              <Line
                color={0xffff00}
                linewidth={4}
                p0={new THREE.Vector3(0,0,0)}
                p1={new THREE.Vector3(compassPosition.x, compassPosition.y, 0).normalize().multiplyScalar(compassRadius)}
              />
              <Line
                color={0x666600}
                p0={new THREE.Vector3(0,0,0)}
                p1={position}
              />
            </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default flow(
  withSceneContext,
  withConfigContext,
)(Sun)
