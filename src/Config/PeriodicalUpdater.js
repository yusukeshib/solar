import React from 'react'

export default class PeriodicalUpdater extends React.PureComponent {
  onUpdate = () => {
    const { onUpdate } = this.props
    onUpdate()
  }
  componentDidMount() {
    const { span } = this.props
    this.onUpdate()
    this.interval = setInterval(this.onUpdate, span)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  componentWillReceiveProps({ span }) {
    if(this.props.span !== span) {
      clearInterval(this.interval)
      this.interval = setInterval(this.onUpdate, span)
    }
  }
  render() {
    return false
  }
}
PeriodicalUpdater.defaultProps = {
  span: 1000*60,
  onUpdate: () => {}
}
