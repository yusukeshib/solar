import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class GridHelper extends React.PureComponent {
  componentDidMount() {
    const { rotation, size, scene } = this.props
    this._helper = new THREE.GridHelper(size)
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
GridHelper.defaultProps = {
  size: 10,
  rotation: new THREE.Euler(Math.PI/2, 0,0,'XYZ')
}

export default withSceneContext(GridHelper)

