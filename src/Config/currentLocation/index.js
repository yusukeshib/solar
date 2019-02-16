export default async () => {
  try {
    // location
    const { coords } = await new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return {
      key: 'Here',
      latitude: coords.latitude,
      longitude: coords.longitude
    }
  } catch(err) {
    return null
  }
}
