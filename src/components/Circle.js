import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class Circle extends React.PureComponent {
  componentDidMount() {
    const { objRef, linewidth, radius, position, segment, color, scene } = this.props
    const geometry = new THREE.Geometry()
    for(let i = 0; i <= segment; i++) {
      const theta = (i / segment) * Math.PI * 2
      geometry.vertices.push(new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        0,
      )
      )
    }
    const material = new THREE.LineBasicMaterial({ color, linewidth })
    this._node = new THREE.Line(geometry, material)
    scene.add(this._node)
    this.updatePosition()
    objRef(this._node)
  }
  updatePosition(props) {
    const { position } = props || this.props
    this._node.position.copy(position)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.position !== nextProps.position) {
      this.updatePosition(nextProps)
    }
  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._node)
  }
  render() {
    return false
  }
}
Circle.defaultProps = {
  radius: 1,
  segment: 100,
  color: 0xff0000,
  position: new THREE.Vector3(0,0,0),
  linewidth: 1,
  objRef: () => {}
}

export default withSceneContext(Circle)

