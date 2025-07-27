import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx is loading...');
console.log('Navigation component should be loading with enlarged logo');
createRoot(document.getElementById("root")!).render(<App />);
console.log('App rendered successfully with updated navigation');
