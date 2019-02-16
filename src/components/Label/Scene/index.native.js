import React from 'react'
import createGeometry from 'three-bmfont-text'
import font from './lato-16.json'
import glyph from './lato-16.png'
import pify from 'pify'
import Scene from 'components/Scene'
import OrthographicCamera from 'components/OrthographicCamera'
import omit from 'lodash/omit'
import { withRendererContext } from 'components/Renderer'
import AxisHelper from 'components/AxisHelper'
import GridHelper from 'components/GridHelper'
import Text from './Text'
import { LabelContext } from './Context'
import { loadAsync } from 'expo-three'

let uniq = 0

class LabelProvider extends React.PureComponent {
  labelMap = {}
  materialCache = {}
  async componentDidMount() {
    const textureLoader = new THREE.TextureLoader()
    const map = await loadAsync(glyph)
    this.setState({ map })
  }
  addLabel = (label) => {
    const id = ++uniq
    this.labelMap = {
      ...this.labelMap,
      [id]: { id, ...label }
    }
    this.setState({ labelMap: this.labelMap })
    return id
  }
  createMaterial = (color) => {
    const { map } = this.state
    if(!this.materialCache[color]) {
      this.materialCache[color] = new THREE.MeshBasicMaterial({ map, transparent: true, color })
    }
    return this.materialCache[color]
  }
  createGeometry = (text) => {
    return createGeometry({ mode: 'pre', font, text })
  }
  updateLabel = (id, props) => {
    this.labelMap = {
      ...this.labelMap,
      [id]: {
        ...this.labelMap[id],
        ...props
      }
    }
    this.setState({ labelMap: this.labelMap })
  }
  removeLabel = (id) => {
    this.labelMap = omit(this.labelMap, [id])
    this.setState({ labelMap: this.labelMap })
  }
  state = {
    labelMap: {},
    createGeometry: this.createGeometry,
    createMaterial: this.createMaterial,
    addLabel: this.addLabel,
    removeLabel: this.removeLabel,
    updateLabel: this.updateLabel
  }
  onCreate = (mainScene) => {
    this.setState({ mainScene })
  }
  render() {
    const { scene, width, height, children } = this.props
    const { map, labelMap, mainScene } = this.state
    const labels = Object.values(labelMap)
    return (
      <LabelContext.Provider value={this.state}>
        <Scene objRef={this.onCreate}>
          { children }
        </Scene>
        {/* map &&
        <Scene>
          <OrthographicCamera
            left={0}
            right={width}
            top={0}
            bottom={height}
            near={0.001}
            far={100000000000}
          >
            { labels.map(label => (
              <Text
                key={label.id}
                {...label}
              />
            ))}
          </OrthographicCamera>
        </Scene>
        */}
      </LabelContext.Provider>
    )
  }
}
export default withRendererContext(LabelProvider)
