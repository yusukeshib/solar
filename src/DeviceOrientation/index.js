import React from 'react'
import * as THREE from 'three'
import { withConfigContext } from '../Config/Context'
import clamp from 'lodash/clamp'
import { Spring, config } from 'react-spring'
import * as ease from 'd3-ease'

const preset = {
  precision: 1,
  duration: 1000,
  easing: ease.easeCubicOut
}

class DeviceOrientation extends React.PureComponent {
  state = {
    animating: false,
    touchQuaternion: new THREE.Quaternion(),
    deviceQuaternion: new THREE.Quaternion()
  }
  onSpringEnd = () => {
    this.setState({ animating : false })
  }
  componentWillReceiveProps({ compassModeEnabled }) {
    if(this.props.compassModeEnabled !== compassModeEnabled) {
      this.setState({ animating : true })
    }
  }
  onMouseDown = (evt) => {
    const { animating } = this.state
    if(animating) return
    const e = evt.touches ? evt.touches[0] : evt
    this._p = { x: e.clientX, y: e.clientY }
  }
  onMouseMove = (evt) => {
    const { animating } = this.state
    if(animating) return
    const { compassModeEnabled, onChange } = this.props
    if(!this._p) return
    if(!evt.touches || evt.touches.length === 1) {
      const e = evt.touches ? evt.touches[0] : evt
      const p = { x: e.clientX, y: e.clientY }
      let dx = p.x - this._p.x
      let dy = p.y - this._p.y
      this._p = p

      const delta = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        0,
        0,
        THREE.Math.degToRad(-dx),
        'XYZ'
      ))
      const touchQuaternion = new THREE.Quaternion().multiplyQuaternions(this.state.touchQuaternion, delta)

      this.setState({ touchQuaternion })
      // onChange({ quaternion })
    }
    else if(evt.touches && evt.touches.length === 2) {
      const touches = evt.touches
      const x1 = touches[0].pageX
      const y1 = touches[0].pageY
      const x2 = touches[1].pageX
      const y2 = touches[1].pageY
      const distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
      if(this.distance > 0) {
        this.onScaleChange(distance/this.distance)
      }
      this.distance = distance
    }
  }
  onScaleChange = (delta) => {
    const { fov, setParameter } = this.props
    const value = clamp(fov/delta, 15, 135)
    setParameter('fov', value)
  }
  onMouseUp = (evt) => {
    this.distance = -1
    this._p = null
  }
  componentDidMount() {
    window.addEventListener('touchstart', this.onMouseDown)
    window.addEventListener('touchmove', this.onMouseMove)
    window.addEventListener('touchend', this.onMouseUp)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener( 'orientationchange', this.onScreenOrientationChange, false )
    window.addEventListener( 'deviceorientation', this.onDeviceOrientationChange, false )
  }
  componentWillUnmount() {
    window.removeEventListener('touchstart', this.onMouseDown)
    window.removeEventListener('touchmove', this.onMouseMove)
    window.removeEventListener('touchend', this.onMouseUp)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener( 'orientationchange', this.onScreenOrientationChange, false )
    window.removeEventListener( 'deviceorientation', this.onDeviceOrientationChange, false )
  }
  onDeviceOrientationChange = evt => {
    const { animating } = this.state
    if(animating) return
    const alpha = THREE.Math.degToRad(evt.alpha)
    const beta  = THREE.Math.degToRad(evt.beta)
    const gamma = THREE.Math.degToRad(evt.gamma)
    const deviceQuaternion = new THREE.Quaternion()
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), alpha))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), beta))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), gamma))
    this.setState({ deviceQuaternion })
  }
  onScreenOrientationChange = () => {
  }
  render() {
    const { compassModeEnabled, compassRadius, children } = this.props
    const { animating, touchQuaternion, deviceQuaternion } = this.state
    const quaternion = new THREE.Quaternion()
      .multiply(touchQuaternion)
      .multiply(deviceQuaternion)
    const position = compassModeEnabled
      ? new THREE.Vector3(0, 0, compassRadius*4).applyQuaternion(quaternion)
      : new THREE.Vector3(0, 0, 0)

    return (
      <Spring
        config={preset}
        immediate={!animating}
        onRest={this.onSpringEnd}
        to={{
          x: position.x,
          y: position.y,
          z: position.z
        }}
      >
        {({ x, y, z }) => (
          <>
          { children && children({
            animating,
            quaternion,
            position: new THREE.Vector3(x, y, z)
          }) }
          </>
        )}
      </Spring>
    )
  }
}
DeviceOrientation.defaultProps = {
  touchEnabled: true,
  deviceOrientationEnabled: true,
  onChange: () => {},
  onScaleChange: () => {}
}
export default withConfigContext(DeviceOrientation)
