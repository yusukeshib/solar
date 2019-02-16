import React from 'react'
import styled from 'styled-components'
import { withConfigContext } from './Context'
import flow from 'lodash/flow'
import {
  Switch,
  List,
  Surface,
  Appbar,
  Divider,
  withTheme
} from 'react-native-paper'
import { BackHandler, ScrollView } from 'react-native'
import t from '../translation'

const Container = styled(Surface)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`

class Config extends React.PureComponent {
  state = {}
  onShowPlanetLabelChange = (evt) => {
    const { showPlanetLabel, setParameter } = this.props
    setParameter('showPlanetLabel', !showPlanetLabel)
  }
  onShowStarLabelChange = (value) => {
    const { showStarLabel, setParameter } = this.props
    setParameter('showStarLabel', !showStarLabel)
  }
  onShowConstellationChange = (value) => {
    const { showConstellation, setParameter } = this.props
    setParameter('showConstellation', !showConstellation)
  }
  onShowCompassChange = (value) => {
    const { showCompass, setParameter } = this.props
    setParameter('showCompass', !showCompass)
  }
  onKeepAwakeChange = (value) => {
    const { keepAwake, setParameter } = this.props
    setParameter('keepAwake', !keepAwake)
  }
  onVisibleStarMagnitudeChange = (value) => {
    const { setParameter } = this.props
    setParameter('visibleStarMagnitude', value)
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onClose)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onClose)
  }
  onClose = () => {
    const { open, onClose } = this.props
    if(!open) return false
    if(onClose) onClose()
    return true 
  }
  render() {
    const {
      theme,
      onClose,
      keepAwake,
      visibleStarMagnitude,
      showConstellation,
      showCompass,
      showStarLabel,
      showPlanetLabel,
      height,
      open
    } = this.props
    if(!open) return false
    return (
      <Container>
        <Appbar>
          <Appbar.BackAction onPress={onClose}/>
          <Appbar.Content title={t('Settings')} />
        </Appbar>
        <ScrollView>
        <List.Section title={t('Element visibility')}>
          <Divider/>
          <List.Item
            title={t('Show Star Labels')}
            description={t(`If you want to hide star's labels, uncheck this`)}
            left={props => <List.Icon {...props} icon='label' />}
            right={props => (
              <Switch
                {...props}
                color={theme.colors.accent}
                value={showStarLabel}
                onValueChange={this.onShowStarLabelChange}
              />
            )}
          />
          <Divider/>
          <List.Item
            title={t('Show Planet Labels')}
            description={t(`If you want to hide planet's labels, uncheck this`)}
            left={props => <List.Icon {...props} icon='public' />}
            right={props => (
              <Switch
                {...props}
                color={theme.colors.accent}
                value={showPlanetLabel}
                onValueChange={this.onShowPlanetLabelChange}
              />
            )}
          />
          <Divider/>
          <List.Item
            title={t('Show Constellations')}
            description={t(`If you want to hide constellations, uncheck this`)}
            left={props => <List.Icon {...props} icon='timeline' />}
            right={props => (
              <Switch
                {...props}
                color={theme.colors.accent}
                value={showConstellation}
                onValueChange={this.onShowConstellationChange}
              />
            )}
          />
          <Divider/>
          <List.Item
            title={t('Show Compass')}
            description={t(`If you want to hide compass element, uncheck this`)}
            left={props => <List.Icon {...props} icon='my-location' />}
            right={props => (
              <Switch
                {...props}
                color={theme.colors.accent}
                value={showCompass}
                onValueChange={this.onShowCompassChange}
              />
            )}
          />
          <Divider/>
        </List.Section>
        <List.Section title={t('Misc')}>
          <Divider/>
          <List.Item
            title={t('Keep Awake')}
            description={t(`If you want to avoid device sleep, check this`)}
            left={props => <List.Icon {...props} icon='visibility' />}
            right={props => (
              <Switch
                {...props}
                color={theme.colors.accent}
                value={keepAwake}
                onValueChange={this.onKeepAwakeChange}
              />
            )}
          />
          <Divider/>
        </List.Section>
        </ScrollView>
      </Container>
    )
  }
}

export default flow(
  withConfigContext,
  withTheme
)(Config)
