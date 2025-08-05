// src/main.tsx
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalStyles } from './styles/GlobalStyles.js'
import { RouterProvider } from 'react-router-dom'
import router from './routes'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <GlobalStyles/>
    <RouterProvider router={router} />
  </StrictMode>
)