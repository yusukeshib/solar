import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import loadTexture from './texture'

class Plane extends React.PureComponent {
  async componentDidMount() {
    const { transparent, map: mapUrl, quaternion, position, objRef, width, height, color, scene } = this.props
    scene.remove(this._obj)
    const map = mapUrl && await loadTexture(mapUrl)
    this._geometry = new THREE.PlaneGeometry(width, height)
    this._material = new THREE.MeshBasicMaterial({ transparent, color, map })
    this._obj = new THREE.Mesh(this._geometry, this._material)
    this._obj.position.copy(position)
    this._obj.quaternion.copy(quaternion)
    scene.add(this._obj)
    objRef(this._obj)
  }
  componentWillReceiveProps(nextProps) {
    if(!this._obj) return
    if(this.props.quaternion  !== nextProps.quaternion) {
      this._obj.quaternion.copy(nextProps.quaternion)
    }
    if(this.props.position  !== nextProps.position) {
      this._obj.position.copy(nextProps.position)
    }
    if(this.props.width !== nextProps.width) {
      this._geometry.width = nextProps.width
    }
    if(this.props.height !== nextProps.height) {
      this._geometry.height = nextProps.height
    }
    if(this.props.color !== nextProps.color) {
      this._material.color = nextProps.color
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
Plane.defaultProps = {
  transparent: false,
  quaternion: new THREE.Quaternion(),
  position: new THREE.Vector3(),
  color: 0xff0000,
  width: 100,
  height: 100,
  objRef: () => {}
}

export default withSceneContext(Plane)

