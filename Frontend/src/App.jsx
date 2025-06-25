import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

import { Box, Container, Snackbar } from "@mui/material";


import Header from './components/Header';
import AppDrawer from './components/AppDrawer';

function App() {

  return (
    <Box>
      <Header />
      <AppDrawer />
    </Box>
   
     
  )
}

export default App
