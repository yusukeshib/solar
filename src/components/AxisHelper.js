import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class AxesHelper extends React.PureComponent {
  componentDidMount() {
    const { rotation, size, scene } = this.props
    this._helper = new THREE.AxesHelper(size)
    if(rotation) {
      this._helper.setRotationFromEuler(rotation)
    }
    scene.add(this._helper)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._helper)
  }
  render() {
    return false
  }
}
AxesHelper.defaultProps = {
  size: 1000
}

export default withSceneContext(AxesHelper)

