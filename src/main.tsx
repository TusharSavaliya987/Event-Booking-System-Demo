import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { store } from './store/store';
import { setLoading } from './store/slices/eventsSlice';

// Simulate loading delay
store.dispatch(setLoading(true));
setTimeout(() => {
  store.dispatch(setLoading(false));
}, 2000); // 2 seconds delay

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
