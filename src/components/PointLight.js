import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class PointLight extends React.PureComponent {
  componentDidMount() {
    const { position, color, intensity, distance, decay, scene } = this.props
    this._light = new THREE.PointLight(color, intensity, distance, decay)
    this._light.position.copy(position)
    scene.add(this._light)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._light)
  }
  componentWillReceiveProps(nextProps) {
    const { position } = nextProps
    if(position !== this.props.position) {
      this._light.position.copy(position)
    }
  }
  render() {
    return false
  }
}

export default withSceneContext(PointLight)
