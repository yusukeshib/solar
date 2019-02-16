import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import { withConfigContext } from './Config/Context'
import flow from 'lodash/flow'
import Label from 'components/Label'
import Sphere from 'components/Sphere'
import Line from 'components/Line'
import Circle from 'components/Circle'
import Cylinder from 'components/Cylinder'

class Compass extends React.PureComponent {
  render() {
    const { animating, compassModeEnabled, position, showCompass, radius } = this.props
    if(!showCompass) return false
    return (
      <React.Fragment>
        <Label
          color={0xff0000}
          position={new THREE.Vector3(position.x + radius, position.y, position.z)}
        >N</Label>
        <Label
          color={0xffffff}
          position={new THREE.Vector3(position.x, position.y + radius, position.z)}
        >W</Label>
        <Label
          color={0xffffff}
          position={new THREE.Vector3(position.x - radius, position.y, position.z)}
        >S</Label>
        <Label
          color={0xffffff}
          position={new THREE.Vector3(position.x, position.y - radius, position.z)}
        >E</Label>
        <Circle
          color={0x999999}
          linewidth={4}
          position={position}
          radius={radius}
        />
        { !animating && compassModeEnabled &&
            <React.Fragment>
              <Sphere
                radius={15000}
                position={new THREE.Vector3(0,0,50000)}
                color={0x00ff00}
                type='basic'
              />
              <Cylinder
                radius={5000}
                height={50000}
                rotation={new THREE.Euler(Math.PI/2, 0,0,'XYZ')}
                position={new THREE.Vector3(0,0,25000)}
                color={0x00ff00}
                type='basic'
              />
            </React.Fragment>
        }
      </React.Fragment>
    )
  }
}
Compass.defaultProps = {
  radius: 1, // 1km
  objRef: () => {},
  position: new THREE.Vector3(0,0,0)
}

export default flow(
  withSceneContext,
  withConfigContext
)(Compass)
