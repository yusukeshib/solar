// import 'typeface-roboto'
import React from 'react'
import Main from './Main'
import { ConfigProvider } from './Config/Context'
import Fullscreen from './Fullscreen'
import Config from './Config'
import BottomNavigation from './BottomNavigation'

export default class App extends React.Component {
  state = {}
  onConfigToggle = () => {
    const { configOpened } = this.state
    this.setState({
      configOpened: !configOpened
    })
  }
  onConfigClose = () => {
    this.setState({
      configOpened: false
    })
  }
  render() {
    const { configOpened } = this.state
    return (
      <ConfigProvider>
        <Fullscreen>
          { size => <Main {...size} touchEnabled={!configOpened} /> }
        </Fullscreen>
        <BottomNavigation onToggle={this.onConfigToggle}/>
        <Config
          open={configOpened}
          onClose={this.onConfigClose}
        />
      </ConfigProvider>
    )
  }
}
