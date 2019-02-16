import React from 'react'
import LOCATIONS from '../data/location'
import storage from '../Storage'
import currentLocation from './currentLocation'
import PeriodicalUpdater from './PeriodicalUpdater'
import t from '../translation'
import { METERS_PER_ASTRONOMICAL_UNIT } from '../utils/astronomy'

const ConfigContext = React.createContext({})

export const withConfigContext = Component => props => {
  return (
    <ConfigContext.Consumer>
      {context => <Component {...props} {...context}/>}
    </ConfigContext.Consumer>
  )
}

export class ConfigProvider extends React.PureComponent {
  onUpdate = async () => {
    this.setState({
      now: Date.now(),
      initialized: true
    })
    const here = await currentLocation()
    this.setState({ here })
  }
  setParameter = async (key, value) => {
    const state = typeof key === 'object' ? key : { [key]: value }
    await this.setState(state)
    await storage.setItem('config', JSON.stringify(this.state))
  }
  state = {
    compassRadius: 405139,
    fov: 45,
    date: Date.now(),
    location: { ...LOCATIONS[0], key: t(LOCATIONS[0].key) },
    visibleStarMagnitude: 3,
    dateNow: true,
    locationHere: true,
    showStarLabel: true,
    showPlanetLabel: true,
    showCompass: true,
    showConstellation: true,
    setParameter: this.setParameter,
    keepAwake: true,
    compassModeEnabled: true
  }
  async componentDidMount() {
    const config = JSON.parse(await storage.getItem('config'))
    if(config) {
      // console.log('config:', config)
      await this.setState(config)
    }
    await this.onUpdate()
  }
  render() {
    const { initialized, here, now, ...config } = this.state
    const { children } = this.props
    const value = {
      here,
      ...config,
      ...config.locationHere && here && { location: here },
      ...config.dateNow && now && { date: now },
    }
    return (
      <ConfigContext.Provider value={value}>
        <PeriodicalUpdater
          span={1000*60}
          onUpdate={this.onUpdate}
        />
        {initialized && children}
      </ConfigContext.Provider>
    )
  }
}
