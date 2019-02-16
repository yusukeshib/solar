import React from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import {
  TextInput,
  List,
  Dialog,
  Text,
  Surface,
  IconButton,
  Button,
  Appbar,
  Divider,
  ProgressBar
} from 'react-native-paper'
import LOCATIONS from '../data/location'
import { BackHandler, ScrollView } from 'react-native'
import { withConfigContext } from '../Config/Context'
import throttle from 'lodash/throttle'
import { Location, Permissions } from 'expo'
import t from '../translation'

const Input = styled(TextInput)`
  background-color: transparent;
  color: white;
  flex: 1;
  height: 100%;
  border: 0;
`

const Container = styled(Surface)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`

class LocationPicker extends React.PureComponent {
  state = {
    searchText: ''
  }
  constructor(props) {
    super(props)
    this.search = throttle(this.search, 500, { heading: false })
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onClose)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onClose)
  }
  onClose = () => {
    const { open, onClose } = this.props
    this.setState({ search: false })
    if(!open) return false
    if(onClose) onClose()
    return true 
  }
  onSearch = () => {
    const { search } = this.state
    this.setState({ search: !search })
  }
  onChangeText = async (searchText) => {
    await this.setState({ searchText })
    await this.search(searchText)
  }
  async search(searchText) {
    this.setState({ searching: true })
    const searchResults = await Location.geocodeAsync(searchText)
    this.setState({ searching: false, searchResults })
  }
  render() {
    const { here, open, onChange } = this.props
    const { searching, searchResults, searchText, search } = this.state
    if(!open) return false
    return (
      <Container>
        <Appbar>
          <Appbar.BackAction onPress={this.onClose}/>
          { search
              ? <Input
                  autoFocus
                  value={searchText}
                  onChangeText={this.onChangeText}
                />
              : <Appbar.Content title={t('Select Location')} />
          }
          <Appbar.Action icon='search' onPress={this.onSearch} />
        </Appbar>
        { search 
            ?
            <ScrollView>
              {searchResults && searchResults.map((location, i) => (
                <React.Fragment key={i}>
                  <List.Item 
                    title={searchText}
                    onPress={() => onChange({ key: searchText, ...location }, false)}
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </ScrollView>
            :
            <ScrollView>
              { here &&
                  <List.Item 
                    title={`${t('Here')} (${here.key})`}
                    onPress={() => onChange(null, true)}
                  />
              }
              <Divider/>
              {LOCATIONS.map((location, i) => (
                <React.Fragment key={i}>
                  <List.Item 
                    title={t(location.key)}
                    onPress={() => onChange({ ...location, key: t(location.key) }, false)}
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </ScrollView>
        }
      </Container>
    )
  }
}

export default withConfigContext(LocationPicker)
