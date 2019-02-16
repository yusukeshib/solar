import React from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { DateTimePicker } from 'material-ui-pickers'
import NativeButton from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ConfigIcon from '@material-ui/icons/Settings'
import CompassIcon from '@material-ui/icons/Explore'
import CompassOffIcon from '@material-ui/icons/ExploreOff'
import dayjs from 'dayjs'
import pify from 'pify'
import LOCATIONS from '../data/location'
import NativeIconButton from '@material-ui/core/IconButton'
import { withConfigContext } from '../Config/Context'
import NativeLocationIcon from '@material-ui/icons/LocationOn'
import TimerIcon from '@material-ui/icons/Timer'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const IconButton = styled(NativeIconButton)`
  && {
    padding: 0;
    margin-left: 16px;
    width: 24px;
    height: 24px;
  }
`
const DateIcon = withStyles(({ palette }) => ({
  root: {
    color: palette.text.primary
  }
}))(TimerIcon)
const DateOffIcon = withStyles(({ palette }) => ({
  root: {
    color: palette.text.primary
  }
}))(TimerOffIcon)
const LocationIcon = withStyles(({ palette }) => ({
  root: {
    color: palette.text.primary
  }
}))(NativeLocationIcon)

const Hidden = styled.div`
  display: none;
`
const Button = styled(NativeButton)`
  height: 48px;
`
const Main = styled.div`
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`
const Container = styled(Paper)`
  && {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    right: 0;
    bottom: 0;
    height: 48px;
    width: 100%;
    max-height: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 16px;
  }
`
const Sep = styled.div`
  flex: 1;
`

class BottomNavigation extends React.PureComponent {
  state = {}
  onDateChange = (date) => {
    const { setParameter } = this.props
    setParameter({
      date: date.getTime(),
      dateNow: false
    })
  }
  onDateMenuOpen = (evt) => {
    this.setState({ dateEl: evt.currentTarget })
  }
  onDateMenuClose = () => {
    this.setState({ dateEl: null })
  }
  onLocationMenuOpen = (evt) => {
    this.setState({ locationEl: evt.currentTarget })
  }
  onLocationMenuClose = () => {
    this.setState({ locationEl: null })
  }
  onLocationSelect = (location) => {
    const { setParameter } = this.props
    this.setState({ locationEl: null })
    setParameter({
      location,
      locationHere: false
    })
  }
  onDatePickerCreate = (node) => {
    this._datePicker = node
  }
  onOpenDatePicker = () => {
    this.setState({ dateEl: null })
    this._datePicker.open()
  }
  onToggleDateNow = (dateNow) => {
    const { setParameter } = this.props
    setParameter('dateNow', dateNow)
    this.setState({ dateEl: null })
  }
  onToggleLocationHere = (locationHere) => {
    const { setParameter } = this.props
    setParameter({ locationHere })
    this.setState({ locationEl: null })
  }
  onToggleCompassMode = () => {
    const { compassModeEnabled, setParameter } = this.props
    setParameter({
      compassModeEnabled: !compassModeEnabled
    })
  }
  render() {
    const { compassModeEnabled, locationHere, here, onToggle, dateNow, date, location } = this.props
    const { dateEl, locationEl } = this.state
    return (
      <Container>
        <Hidden>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              ref={this.onDatePickerCreate}
              ampm={false}
              value={new Date(date)}
              onChange={this.onDateChange}
              format='YYYY-MM-dd hh:mm'
            />
          </MuiPickersUtilsProvider>
        </Hidden>
        {/* date */}
        { dateNow ? <DateIcon/> : <DateOffIcon/> }
        <Button onClick={this.onDateMenuOpen}>
          { dateNow ? 'Now' : dayjs(date).format('YYYY-MM-DD HH:mm') }
        </Button>
        <Menu
          id='date'
          anchorEl={dateEl}
          open={Boolean(dateEl)}
          onClose={this.onDateMenuClose}
        >
          <MenuItem onClick={() => this.onToggleDateNow(true)}>Now</MenuItem>
          <MenuItem onClick={this.onOpenDatePicker}>Specific Date</MenuItem>
        </Menu>

        {/* location */}
        <LocationIcon/>
        <Button
          aria-owns={locationEl ? 'location' : null}
          aria-haspopup='true'
          onClick={this.onLocationMenuOpen}
        >
          { locationHere && here ? `HERE(${here.key})` : location.key }
        </Button>
        <Menu
          id='location'
          anchorEl={locationEl}
          open={Boolean(locationEl)}
          onClose={this.onLocationMenuClose}
        >
          <MenuItem
            onClick={() => this.onToggleLocationHere(true)}
          >
            Here
          </MenuItem>
          { LOCATIONS.map((location, i) => (
            <MenuItem key={i} onClick={() => this.onLocationSelect(location)}>{location.key}</MenuItem>
          ))}
        </Menu>
        <Sep/>
        {/*<IconButton onClick={onToggle}>
          <ConfigIcon/>
        </IconButton>*/}
        <IconButton onClick={this.onToggleCompassMode}>
          { compassModeEnabled ? <CompassIcon/> : <CompassOffIcon/> }
        </IconButton>
      </Container>
    )
  }
}

export default withConfigContext(BottomNavigation)
