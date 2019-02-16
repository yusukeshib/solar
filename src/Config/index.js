import React from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import { withConfigContext } from './Context'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import LabelIcon from '@material-ui/icons/Label'
import TimelineIcon from '@material-ui/icons/Timeline'
import PublicIcon from '@material-ui/icons/Public'
import CompassIcon from '@material-ui/icons/MyLocation'
import BackIcon from '@material-ui/icons/Close'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`
const Panel = styled(Paper)`
  max-width: 640px;
  min-height: 100%;
  width: 100%;
`
const BackButton = styled(IconButton)`
  && {
    margin-left: -12px;
    margin-right: 20px;
  }
`

class Config extends React.PureComponent {
  onShowConstellationChange = evt => {
    const { setParameter } = this.props
    setParameter('showConstellation', evt.target.checked)
  }
  onShowCompassChange = evt => {
    const { setParameter } = this.props
    setParameter('showCompass', evt.target.checked)
  }
  onStarLabelChange = evt => {
    const { setParameter } = this.props
    setParameter('showStarLabel', evt.target.checked)
  }
  onPlanetLabelChange = evt => {
    const { setParameter } = this.props
    setParameter('showPlanetLabel', evt.target.checked)
  }
  render() {
    const {
      onClose,
      showConstellation,
      showCompass,
      showPlanetLabel,
      showStarLabel,
      open
    } = this.props
    return (
      <Container open={open}>
        <Panel>
          <AppBar position="static">
            <Toolbar>
              <BackButton onClick={onClose} color="inherit" aria-label="Menu">
                <BackIcon />
              </BackButton>
              <Typography variant="h6" color="inherit">
                Settings
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListSubheader>Element Visibility</ListSubheader>
            <ListItem>
              <ListItemIcon>
                <LabelIcon />
              </ListItemIcon>
              <ListItemText
                primary='Show Star Labels'
                secondary={`If you want to hide star's labels, uncheck this.`}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={showStarLabel}
                  onChange={this.onStarLabelChange}
                  color='primary'
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText
                primary='Show Planet Labels'
                secondary={`If you want to hide planet's labels, uncheck this.`}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={showPlanetLabel}
                  onChange={this.onPlanetLabelChange}
                  color='primary'
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText
                primary='Show Constellations'
                secondary={`If you want to hide constellations, uncheck this.`}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={showConstellation}
                  onChange={this. onShowConstellationChange}
                  color='primary'
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemIcon>
                <CompassIcon />
              </ListItemIcon>
              <ListItemText
                primary='Show Compass'
                secondary={`If you want to hide compass element, uncheck this.`}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={showCompass}
                  onChange={this. onShowCompassChange}
                  color='primary'
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
          </List>
        </Panel>
      </Container>
    )
  }
}

export default withConfigContext(Config)
