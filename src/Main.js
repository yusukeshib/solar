import React from 'react'
import KeepAwake from './KeepAwake'
import * as THREE from 'three'
import Scene from 'components/Scene'
import AmbientLight from 'components/AmbientLight'
import Earth from './Earth'
import Sun from './Sun'
import Moon from './Moon'
import Planet from './Planet'
import Stars from './Stars'
import Constellations from './Constellations'
import AxisHelper from 'components/AxisHelper'
import GridHelper from 'components/GridHelper'
import { withConfigContext } from './Config/Context'
import Compass from './Compass'
import range from 'lodash/range'
import PerspectiveCamera from 'components/PerspectiveCamera'
import DeviceOrientation from './DeviceOrientation'
import AppActive from './AppActive'
import Plane from 'components/Plane'
import Renderer from 'components/Renderer'
import LabelScene from 'components/Label/Scene'
import delay from 'delay'
import { METERS_PER_ASTRONOMICAL_UNIT } from './utils/astronomy'

class Main extends React.PureComponent {
  state = {
  }
  render() {
    const { quaternion } = this.state
    const {
      compassRadius,
      fov,
      touchEnabled,
      showConstellation,
      keepAwake,
      width,
      height,
    } = this.props

    return (
      <Renderer width={width} height={height}>
        <DeviceOrientation>
          {({ quaternion, animating, position }) => (
            <LabelScene>
              <AppActive>
                { keepAwake && <KeepAwake /> }
                <PerspectiveCamera
                  fov={fov}
                  near={0.001}
                  far={100000000000}
                  quaternion={quaternion}
                  position={position}
                >
                  <AmbientLight/>
                  <Sun />
                  {/*<Earth />*/}
                  <Moon />
                  <Planet name='Venus'/>
                  <Planet name='Mercury'/>
                  <Planet name='Mars'/>
                  <Planet name='Jupiter'/>
                  <Planet name='Neptune'/>
                  <Planet name='Saturn'/>
                  <Planet name='Uranus'/>
                  <Stars showLabel={!animating} />
                  { showConstellation && <Constellations/> }
                  <Compass animating={animating} radius={compassRadius} />
                </PerspectiveCamera>
              </AppActive>
            </LabelScene>
          )}
        </DeviceOrientation>
      </Renderer>
    )
  }
}
export default withConfigContext(Main)
