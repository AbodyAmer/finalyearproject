import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducer from './reducer'
import Login from './component/login/login'
import LoginContainer from './container/container'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './app'

import store from './reducer/config'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider> 
    , document.querySelector('#app')
)
