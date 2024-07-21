import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { InstructionsProvider } from './components/context/UserInstructions.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InstructionsProvider>
    <App />
    </InstructionsProvider>
  </React.StrictMode>,
)
