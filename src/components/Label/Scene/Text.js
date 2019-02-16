import React from 'react'
import flow from 'lodash/flow'
import { withSceneContext } from 'components/Scene'
import { withLabelContext } from './Context'

class Text extends React.PureComponent {
  componentDidMount() {
    this.updatePosition()
  }
  updatePosition(props) {
    const { color, name, createMaterial, createGeometry, scene, position, mainScene } = props || this.props
    if(!mainScene) return
    const contain  = mainScene.containsPoint(position)
    if(contain) {
      if(!this._obj) {
        const geometry = createGeometry(name)
        const material = createMaterial(color)
        this._obj = new THREE.Mesh(geometry, material)
      }
      scene.add(this._obj)
      const p = mainScene.pointToScreenPosition(position)
      this._obj.position.set(p.x + 5, p.y + 5, 0)
    } else {
      scene.remove(this._obj)
    }
  }
  componentWillReceiveProps(nextProps) {
    this.updatePosition(nextProps)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._obj)
  }
  render() {
    return false
  }
}
export default flow(
  withSceneContext,
  withLabelContext
)(Text)

