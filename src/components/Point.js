import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class Point extends React.PureComponent {
  componentDidMount() {
    const { objRef, position, size, color, scene } = this.props
    const geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0,0,0))
    this._material = new THREE.PointsMaterial({ size, sizeAttenuation: false, color })
    this._node = new THREE.Points(geometry, this._material)
    this._node.position.copy(position)
    scene.add(this._node)
    objRef(this._node)
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._node)
  }
  componentWillReceiveProps(nextProps) {
    const {
      position,
      size,
      color,
    } = nextProps

    if(size !== this.props.size) {
      this._material.size = size
    }
    if(color !== this.props.color) {
      this._material.color = color
    }
    if(position !== this.props.position) {
      this._node.position.copy(position)
    }
  }
  render() {
    const { children } = this.props
    return children || false
  }
}
Point.defaultProps = {
  color: 0xffffff,
  size: 1,
  position: new THREE.Vector3(0,0,0),
  objRef: () => {}
}

export default withSceneContext(Point)

