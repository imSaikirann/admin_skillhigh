import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/StoreContext.jsx';
import { ThemeProvider } from './store/ThemeContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <AppProvider> 
        <App />
      </AppProvider>
      </ThemeProvider>
    </BrowserRouter> 
  </StrictMode>
);
