// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/PageLayout/PageLayout'
import Home from './Home'

export const createRoutes = (store) => ({
  path        : '/raiders',
  component   : CoreLayout,
  indexRoute  : Home(store),
  childRoutes : [
    // Funds(store),
  ]
})

export default createRoutes
