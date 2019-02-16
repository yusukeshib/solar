import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'

class Line extends React.PureComponent {
  componentDidMount() {
    this.updatePosition()
  }
  updatePosition(props) {
    const { objRef, p0, p1, linewidth, color, scene } = props || this.props
    scene.remove(this._obj)
    const geometry = new THREE.Geometry()
    geometry.vertices.push(p0)
    geometry.vertices.push(p1)
    this._material = new THREE.LineBasicMaterial({ color, linewidth })
    this._obj = new THREE.Line(geometry, this._material)
    scene.add(this._obj)
    objRef(this._obj)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.p0 !== nextProps.p0 || this.props.p1 !== nextProps.p1) {
      this.updatePosition(nextProps)
      return
    }
    if(this.props.linewidth !== nextProps.linewidth) {
      this._material.linewidth = linewidth
    }
    if(this.props.color !== nextProps.color) {
      this._material.color = color
    }

  }
  componentWillUnmount() {
    const { scene } = this.props
    scene.remove(this._obj)
  }
  render() {
    return false
  }
}
Line.defaultProps = {
  color: 0xffffff,
  p0: new THREE.Vector3(),
  p1: new THREE.Vector3(),
  linewidth: 1,
  objRef: () => {}
}

export default withSceneContext(Line)

