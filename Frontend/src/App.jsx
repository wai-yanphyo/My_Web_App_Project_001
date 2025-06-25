import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Box, Container, Snackbar } from "@mui/material";


import Header from './components/Header';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box>
      <Header />
    </Box>
   
     
  )
}

export default App
