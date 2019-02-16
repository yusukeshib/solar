import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import Sphere from 'components/Sphere'
import Label from 'components/Label'
import Line from 'components/Line'
import { withConfigContext } from './Config/Context'
import flow from 'lodash/flow'
import astronomy, { METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'

class Moon extends React.PureComponent {
  state = {}
  componentDidMount() {
    this.updatePosition()
  }
  updatePosition(props) {
    const { compassRadius, location, date } = props || this.props

    const day = astronomy.DayValue(new Date(date))
    const distance = astronomy.Moon.DistanceFromEarth(day)
    const hz = astronomy.Moon.HorizontalCoordinates(day, location)
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
    const compassPosition = new THREE.Vector3(position.x, position.y, 0).normalize().multiplyScalar(compassRadius)
    return (
      <React.Fragment>
        { showPlanetLabel &&
            <Label color='white' position={position}>Moon</Label>
        }
        <Sphere
          radius={astronomy.Moon.RadiusInMeters/1000}
          position={position}
        />
        { compassModeEnabled &&
            <React.Fragment>
              <Sphere
                radius={10000}
                position={position}
              />
              <Line
                color={0xffffff}
                linewidth={4}
                p0={new THREE.Vector3(0,0,0)}
                p1={compassPosition}
              />
              <Line
                color={0x666666}
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
)(Moon)
