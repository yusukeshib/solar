import React from 'react'
import * as THREE from 'three'
import Sphere from 'components/Sphere'
import { withConfigContext } from './Config/Context'
import { METERS_PER_EARTH_EQUATORIAL_RADIUS } from './utils/astronomy'
import earthMap from 'assets/earth.jpg'

class Earth extends React.PureComponent {
  state = {
    position: new THREE.Vector3(0, 0, -METERS_PER_EARTH_EQUATORIAL_RADIUS/1000)
  }
  render() {
    const { compassModeEnabled } = this.props
    const { position } = this.state
    if(!compassModeEnabled) return false
    return (
      <Sphere
        map={earthMap}
        radius={METERS_PER_EARTH_EQUATORIAL_RADIUS/1000}
        color={0xffffff}
        position={position}
      />
    )
  }
}
export default withConfigContext(Earth)
