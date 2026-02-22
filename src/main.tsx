import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import './i18n'; // Initialize i18next for translations

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <App />
);
