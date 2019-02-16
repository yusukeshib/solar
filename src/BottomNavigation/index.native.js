import React from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { withConfigContext } from '../Config/Context'
import {
  List,
  Dialog,
  Text,
  Surface,
  IconButton,
  Button as NativeButton,
} from 'react-native-paper'
import DateTimePicker from 'react-native-modal-datetime-picker'
import LocationPicker from '../LocationPicker'
import t from '../translation'

const Button = styled(NativeButton)`
  flex-shrink: 1;
`
const Container = styled(Surface)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 48px;
  border-radius: 4px;
  display: flex;
  padding: 0 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Buttons = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 48px;
`

class BottomNavigation extends React.PureComponent {
  state = {}
  onOpenDateTypePicker = () => {
    this.setState({ dateTypePickerOpened: true })
  }
  onCloseDateTypePicker = () => {
    this.setState({ dateTypePickerOpened: false })
  }
  onOpenDatePicker = (type) => {
    this.setState({
      dateTimePickerType: type,
      dateTypePickerOpened: false,
      datePickerOpened: true
    })
  }
  onCloseDatePicker = () => {
    this.setState({ datePickerOpened: false })
  }
  onOpenLocationPicker = () => {
    this.setState({ locationPickerOpened: true })
  }
  onCloseLocationPicker = () => {
    this.setState({ locationPickerOpened: false })
  }
  onLocationChange = (location, locationHere) => {
    const { setParameter } = this.props
    setParameter({
      location,
      locationHere
    })
    this.setState({ locationPickerOpened: false })
  }
  onToggleDateNow = (dateNow) => {
    const { setParameter } = this.props
    this.setState({
      dateTypePickerOpened: false
    })
    setParameter('dateNow', dateNow)
  }
  onDateChange = date => {
    const { setParameter } = this.props
    setParameter({
      date: date.getTime(),
      dateNow: false
    })
    this.setState({
      dateTypePickerOpened: false,
      datePickerOpened: false
    })
  }
  onToggleCompassMode = () => {
    const { compassModeEnabled, setParameter } = this.props
    setParameter({
      compassModeEnabled: !compassModeEnabled
    })
  }
  render() {
    const { compassModeEnabled, onToggle, dateNow, date, locationHere, location } = this.props
    const { dateTimePickerType, dateTypePickerOpened, datePickerOpened, locationPickerOpened } = this.state
    return (
      <React.Fragment>
        <Container>
          <Buttons>
            <Button color='#ffffff' icon={dateNow ? 'timer' : 'timer-off' } onPress={this.onOpenDateTypePicker}>
              {dateNow ? t('Now') : dayjs(date).format('YYYY-MM-DD HH:mm')}
            </Button>
            <Button color='#ffffff' icon='location-on' onPress={this.onOpenLocationPicker}>
              {locationHere ? `${t('Here')}(${location.key || 'Unspecified'})` : location.key || 'Unspecified'}
            </Button>
          </Buttons>
          {/* <IconButton
            icon='settings'
            onPress={onToggle}
          /> */}
          <IconButton
            icon={ compassModeEnabled ? 'explore' : 'explore-off'}
            onPress={this.onToggleCompassMode}
          />
        </Container>
        <DateTimePicker
          date={new Date(date)}
          mode={dateTimePickerType}
          isVisible={datePickerOpened}
          onConfirm={this.onDateChange}
          onCancel={this.onCloseDatePicker}
        />
        <LocationPicker
          open={locationPickerOpened}
          onClose={this.onCloseLocationPicker}
          onChange={this.onLocationChange}
        />
        <Dialog
          visible={dateTypePickerOpened}
          onDismiss={this.onCloseDateTypePicker}
        >
          <List.Item 
            title={t('Now')}
            onPress={() => this.onToggleDateNow(true)}
          />
          <List.Item 
            title={t('Change Date')}
            onPress={() => this.onOpenDatePicker('date')}
          />
          <List.Item 
            title={t('Change Time')}
            onPress={() => this.onOpenDatePicker('time')}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withConfigContext(BottomNavigation)
