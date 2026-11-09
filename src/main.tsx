import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/site-overrides.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import './styles/magazine.css';

import './styles/travel-refinement.css';

import './styles/sleek.css';
import './styles/finishing.css';

import './styles/editorial-polish.css';
