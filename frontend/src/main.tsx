import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreSession } from './store/slices/authSlice';
import App from '../App';
import './index.css';

// Восстанавливаем сессию при загрузке приложения
store.dispatch(restoreSession());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
