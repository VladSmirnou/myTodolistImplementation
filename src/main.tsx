import { createRoot } from 'react-dom/client';
import TaskApp from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<TaskApp />);
