import React from 'react'
import * as THREE from 'three'
import { Magnetometer, DangerZone } from 'expo'
import mean from 'lodash/mean'
import { PanResponder } from 'react-native'
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import { withConfigContext } from '../Config/Context'
import clamp from 'lodash/clamp'
import { Spring, config } from 'react-spring'
import * as ease from 'd3-ease'

const preset = {
  precision: 1,
  duration: 1000,
  easing: ease.easeCubicOut
}

const Container = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
`
class DeviceOrientation extends React.PureComponent {
  distance = -1
  angles = []
  state = {
    animating: false,
    northQuaternion: new THREE.Quaternion(),
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
  async componentDidMount() {
    DangerZone.DeviceMotion.setUpdateInterval(1000/60)
    DangerZone.DeviceMotion.addListener(this.onMotionData)
    this._magneto = Magnetometer.addListener(this.onMagnetoData)
  }
  componentWillUnmount() {
    this._magneto.remove()
    DangerZone.DeviceMotion.removeAllListeners(this.onMotionData)
  }
  onMagnetoData = (result) => {
    const { deviceQuaternion, animating } = this.state
    if(animating) return
    const current = new THREE.Vector3(1,0,0)
    const north = new THREE.Vector3(result.x, result.y, result.z)
      .applyQuaternion(deviceQuaternion)
      .normalize()
    north.z = 0
    const angle = current.angleTo(north)
    if(!isNaN(angle)) this.angles.push(angle)
  }
  onMotionData = (motion) => {
    const { animating } = this.state
    const { onChange } = this.props
    if(animating) return
    const calibrated = mean(this.angles)
    if(motion && motion.rotation) {
      const alpha = motion.rotation.alpha
      const beta  = motion.rotation.beta
      const gamma = motion.rotation.gamma
      const deviceQuaternion = new THREE.Quaternion()
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), alpha))
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), beta))
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), gamma))
      const northQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-calibrated,'XYZ'))
      this.setState({ northQuaternion, deviceQuaternion })
    }
  }
  onScreenOrientationChange = () => {
  }
  onMouseDown = ({ nativeEvent: evt }) => {
    const e = evt.touches ? evt.touches[0] : evt
    this._p = { x: e.pageX, y: e.pageY }
  }
  onMouseMove = ({ nativeEvent: evt }) => {
    const { onScaleChange } = this.props
    if(!this._p) return
    if(evt.touches && evt.touches.length === 2) {
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
  onMouseUp = (evt) => {
    this.distance = -1
    this._p = null
  }
  onScaleChange = (delta) => {
    const { fov, setParameter } = this.props
    const value = clamp(fov/delta, 15, 135)
    setParameter('fov', value)
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => {},
      onPanResponderGrant: this.onMouseDown,
      onPanResponderMove: this.onMouseMove,
      onPanResponderRelease: this.onMouseUp,
    })
  }
  render() {
    const { compassModeEnabled, compassRadius, children } = this.props
    const { animating, northQuaternion, deviceQuaternion } = this.state
    const quaternion = new THREE.Quaternion()
      .multiply(northQuaternion)
      .multiply(deviceQuaternion)
    const position = compassModeEnabled
      ? new THREE.Vector3(0, 0, compassRadius*4).applyQuaternion(quaternion)
      : new THREE.Vector3(0, 0, 0)

    return (
      <Container {...this._panResponder.panHandlers}>
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
            quaternion,
            position: new THREE.Vector3(x, y, z)
          }) }
          </>
        )}
      </Spring>
      </Container>
    )
  }
}
DeviceOrientation.defaultProps = {
  onChange: () => {},
  onScaleChange: () => {}
}
export default withConfigContext(DeviceOrientation)
