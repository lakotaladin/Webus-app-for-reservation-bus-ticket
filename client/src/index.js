import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
// redux implementacija
import store from './redux/store';
import { Provider } from 'react-redux';

axios.defaults.baseURL = "http://localhost:5000"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Provider i stor su deo implementacije redux-a
  <Provider store={store}>
    <App />
  </Provider>
);

