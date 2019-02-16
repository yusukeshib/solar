import React from 'react'
import { AppState } from 'react-native'

export default class AppActive extends React.Component {
  state = {
    appState: AppState.currentState
  }
  componentDidMount() {
    AppState.addEventListener('change', this.onChange)
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.onChange)
  }
  onChange = (appState) => {
    this.setState({ appState })
  }
  render() {
    const { appState } = this.state
    const { children } = this.props
    return appState === 'active' && children
  }
}
