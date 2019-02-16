import { Location, Permissions } from 'expo'

export default async () => {
  // location
  const { status } = await Permissions.askAsync(Permissions.LOCATION)
  let here 
  if(status === 'granted') {
    const { coords } = await Location.getCurrentPositionAsync({})
    const [ address ] = await Location.reverseGeocodeAsync(coords)
    return {
      key: address ? (address.city || address.region) : 'Here',
      latitude: coords.latitude,
      longitude: coords.longitude
    }
  } else {
    return null
  }
}

