import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ThemedApp from './ThemedApp'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

        <ThemedApp />

  </QueryClientProvider>
  </StrictMode>,
)
