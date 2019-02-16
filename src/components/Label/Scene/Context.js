import React from 'react'

export const LabelContext = React.createContext()

export const withLabelContext = Component => props => {
  return (
    <LabelContext.Consumer>
      {(context) => <Component {...props} {...context} />}
    </LabelContext.Consumer>
  )
}

