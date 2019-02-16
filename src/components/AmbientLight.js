import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class AmbientLight extends React.PureComponent {
  componentDidMount() {
    const { color, intensity, scene } = this.props
    this._light = new THREE.AmbientLight(color, intensity)
    scene.add(this._light)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._light)
  }
  render() {
    return false
  }
}
AmbientLight.defaultProps = {
  intensity: 0.25,
  color: 0xffffff
}

export default withSceneContext(AmbientLight)
