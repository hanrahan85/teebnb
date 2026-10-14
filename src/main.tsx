import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { captureAttribution } from './lib/attribution'

captureAttribution();

// If a resized photo ever fails (e.g. image transforms switched off in
// Supabase), fall back to the original upload rather than a broken image.
window.addEventListener('error', (e) => {
  const img = e.target;
  if (img instanceof HTMLImageElement && img.src.includes('/storage/v1/render/image/public/')) {
    const original = new URL(img.src);
    original.pathname = original.pathname.replace('/render/image/public/', '/object/public/');
    original.search = '';
    img.src = original.toString();
  }
}, true);
createRoot(document.getElementById("root")!).render(<App />);
