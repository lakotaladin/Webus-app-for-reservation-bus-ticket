import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
// redux implementacija
import store from './redux/store';
import { Provider } from 'react-redux';
// Mapa
import "leaflet/dist/leaflet.css";


axios.defaults.baseURL = "https://webus.herokuapp.com"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Provider i stor su deo implementacije redux-a
  <Provider store={store}>
    <App />
  </Provider>
);

