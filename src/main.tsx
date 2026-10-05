import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadTrackingScripts } from './utils/analytics.ts';

loadTrackingScripts();

createRoot(document.getElementById('root')!).render(<App />);
