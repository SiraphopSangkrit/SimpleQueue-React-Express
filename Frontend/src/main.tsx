import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { RouterProvider  }   from 'react-router'
import router from './Approuter.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
