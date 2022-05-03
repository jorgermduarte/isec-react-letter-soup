import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/default/App';
import {Provider} from 'react-redux';
import store from './store/index';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
