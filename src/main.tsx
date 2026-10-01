import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Built pages are prerendered, so hydrate when markup is present; the SPA fallback and the dev server render fresh.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
