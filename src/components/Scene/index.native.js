import React from 'react'
import { THREE } from 'expo-three'
import { withRendererContext } from 'components/Renderer'

const SceneContext = React.createContext({})

export const withSceneContext = Component => props => {
  return (
    <SceneContext.Consumer>
      {(context) => <Component {...props} {...context} />}
    </SceneContext.Consumer>
  )
}

class Scene extends React.PureComponent {
  state = {}
  componentDidMount() {
    const { objRef, pixelRatio, addScene, width, height } = this.props
    // scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.toScreenPosition = this.toScreenPosition
    scene.containsObject = this.containsObject
    scene.containsPoint = this.containsPoint
    scene.pointToScreenPosition = this.pointToScreenPosition
    scene.setCamera = this.setCamera
    scene.pixelRatio = pixelRatio

    this.setState({ scene })
    addScene(this)
    objRef(scene)
  }
  componentWillUnmount() {
    const { removeScene } = this.props
    removeScene(this)
  }
  setCamera = (camera) => {
    this._camera = camera
  }
  containsObject = (obj) => {
    const frustum = new THREE.Frustum()
    const cameraViewProjectionMatrix = new THREE.Matrix4()
    this._camera.updateMatrixWorld() // make sure the camera matrix is updated
    this._camera.matrixWorldInverse.getInverse( this._camera.matrixWorld )
    cameraViewProjectionMatrix.multiplyMatrices( this._camera.projectionMatrix, this._camera.matrixWorldInverse )
    frustum.setFromMatrix( cameraViewProjectionMatrix )

    // frustum is now ready to check all the objects you need
    return frustum.intersectsObject( obj )
  }
  toScreenPosition = (obj) => {
    const { width, height } = this.props
    const vector = new THREE.Vector3()

    const widthHalf  = 0.5 * width
    const heightHalf = 0.5 * height

    obj.updateMatrixWorld()
    vector.setFromMatrixPosition(obj.matrixWorld)
    vector.project(this._camera)

    vector.x = ( vector.x * widthHalf ) + widthHalf
    vector.y = - ( vector.y * heightHalf ) + heightHalf

    return {
      x: vector.x,
      y: vector.y
    }
  }
  containsPoint = (vector) => {
    const frustum = new THREE.Frustum()
    const cameraViewProjectionMatrix = new THREE.Matrix4()
    this._camera.updateMatrixWorld() // make sure the camera matrix is updated
    this._camera.matrixWorldInverse.getInverse( this._camera.matrixWorld )
    cameraViewProjectionMatrix.multiplyMatrices( this._camera.projectionMatrix, this._camera.matrixWorldInverse )
    frustum.setFromMatrix( cameraViewProjectionMatrix )

    // frustum is now ready to check all the objects you need
    return frustum.containsPoint(vector)
  }
  pointToScreenPosition = (position) => {
    const { width, height } = this.props

    const vector = new THREE.Vector3().copy(position)

    const widthHalf  = 0.5 * width
    const heightHalf = 0.5 * height

    vector.project(this._camera)

    vector.x = ( vector.x * widthHalf ) + widthHalf
    vector.y = - ( vector.y * heightHalf ) + heightHalf

    return {
      x: vector.x,
      y: vector.y
    }
  }
  get camera() {
    return this._camera
  }
  renderScene = () => {
    const { renderer } = this.props
    const { scene } = this.state
    if(!this._camera) return
    renderer.render(scene, this._camera)
  }
  componentDidUpdate() {
    const { renderScenes } = this.props
    renderScenes()
  }
  componentWillReceiveProps({ width, height }) {
    if(!this._camera) return
    if(width !== this.props.width || height !== this.props.height) {
      this._camera.aspect = width/height
      this._camera.updateProjectionMatrix()
    }
  }
  render() {
    const { children } = this.props
    return (
      <SceneContext.Provider value={this.state}>
        { this.state.scene && children }
      </SceneContext.Provider>
    )
  }
}
Scene.defaultProps = {
  objRef: () => {}
}
export default withRendererContext(Scene)
