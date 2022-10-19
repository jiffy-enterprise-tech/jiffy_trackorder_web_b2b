import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CssVarsProvider } from '@mui/joy/styles';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssVarsProvider><App /></CssVarsProvider>;
  </React.StrictMode>
)
