import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import loadTexture from './texture'

class Sphere extends React.PureComponent {
  state = {}
  componentDidMount() {
    this.update()
  }
  async update(props) {
    const { type, objRef, position, rotation, color, map, radius, segments, scene } = props || this.props
    if(this._node) {
      scene.remove(this._node)
    }
    this._geometry = new THREE.SphereGeometry(radius, segments, segments)
    if(type === 'lambert') {
      this._material = new THREE.MeshLambertMaterial({ color })
    } else {
      this._material = new THREE.MeshBasicMaterial({ color })
    }
    const mapObj = map && await loadTexture(map)
    if(mapObj) {
      this._material.map = mapObj
    }
    this._node = new THREE.Mesh(this._geometry, this._material)
    if(rotation) {
      this._node.setRotationFromEuler(rotation)
    }
    this._node.position.copy(position)
    scene.add(this._node)
    objRef(this._node)
  }
  componentWillReceiveProps(nextProps) {
    const {
      scene,
      position,
      rotation,
      color,
      radius,
      // map,
      // segments
    } = nextProps
    if(radius !== this.props.radius) {
      this.update(nextProps)
    }
    if(color !== this.props.color) {
      this._material.color = color
    }
    if(this._node && rotation !== this.props.rotation) {
      this._node.setRotationFromEuler(rotation)
    }
    if(this._node && position !== this.props.position) {
      this._node.position.copy(position)
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
Sphere.defaultProps = {
  color: 0xffffff,
  radius: 1,
  segments: 32,
  position: new THREE.Vector3(0,0,0),
  rotation: null,
  objRef: () => {},
  type: 'lambert'
}

export default withSceneContext(Sphere)

