import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import SolarTitle from './components/SolarTitle';
ReactDOM.render(
  <React.StrictMode>
    <SolarTitle />
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
