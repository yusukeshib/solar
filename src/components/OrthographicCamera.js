import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import { withRendererContext } from 'components/Renderer'
import flow from 'lodash/flow'

const CameraContext = React.createContext({})

export const withCameraContext = Component => props => {
  return (
    <CameraContext.Consumer>
      {(context) => <Component {...props} {...context} />}
    </CameraContext.Consumer>
  )
}

class Camera extends React.PureComponent {
  state = {
    frame: 0
  }
  componentDidMount() {
    const { scene, width, height, left, top, right, bottom, near, far, position, quaternion } = this.props
    this._camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
    this._camera.position.copy(position)
    this._camera.quaternion.copy(quaternion)
    scene.setCamera(this._camera)
    this.setState({ camera: this._camera })
  }
  componentWillReceiveProps({ scene, width, height, left, top, right, bottom, near, far, position, quaternion }) {
    let changed = false
    if(this.props.left !== left) {
      this._camera.left = left
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.right !== right) {
      this._camera.right = right
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.top !== top) {
      this._camera.top = top
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.bottom !== bottom) {
      this._camera.bottom = bottom
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.near !== near) {
      this._camera.near = near
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.far !== far) {
      this._camera.far = far
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.position !== position) {
      this._camera.position.copy(position)
      changed = true
    }
    if(this.props.quaternion !== quaternion) {
      this._camera.quaternion.copy(quaternion)
      changed = true
    }
    if(changed) {
      this.setState({ frame: this.state.frame+1 })
    }
  }
  render() {
    const { children } = this.props
    const { camera } = this.state
    return (
      <CameraContext.Provider value={this.state}>
        {camera && children}
      </CameraContext.Provider>
    )
  }
}
Camera.defaultProps = {
  left: 0,
  top: 0,
  right: 100,
  bottom: 100,
  near: 1,
  far: 1000,
  position: new THREE.Vector3(0, 0, 0),
  quaternion: new THREE.Quaternion()
}
export default flow(
  withSceneContext,
  withRendererContext
)(Camera)
