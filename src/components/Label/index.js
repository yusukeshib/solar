import React from 'react'
import flow from 'lodash/flow'
import { withLabelContext } from './Scene/Context'
import { withCameraContext } from 'components/PerspectiveCamera'

class Label extends React.PureComponent {
  componentDidMount() {
    const { children: name, color, position, addLabel } = this.props
    this.id = addLabel({ name, position, color })
  }
  componentWillReceiveProps({ updateLabel, position }) {
    if(this.props.position !== position) {
      updateLabel(this.id, { position })
    }
  }
  componentWillUnmount() {
    const { removeLabel } = this.props
    removeLabel(this.id)
  }
  render() {
    return false
  }
}
export default flow(
  withLabelContext,
  withCameraContext
)(Label)
