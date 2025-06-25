import { 
    Box, 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
} from "@mui/material";

import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
 } from "@mui/icons-material";

import { useApp } from '../ThemedApp';

import { useState } from 'react';

const  Header=()=> {

    const {mode, setMode, showDrawer, setShowDrawer }=useApp();

   

        return (
            <AppBar position="static">
            <Toolbar>
                <IconButton
                color="inherit"
                edge="start"
                 onClick={()=>setShowDrawer(true)}>
                <MenuIcon />
                </IconButton>
                <Typography sx={{ flexGrow: 1, ml: 2 }}>Property Management</Typography>
                <Box>
                
                { mode === "dark" ? (
                    <IconButton
                    color="inherit"
                    edge="end"
                    onClick={()=>setMode("light")}>
                        <LightModeIcon />
                    </IconButton>
                ):
                (
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={()=>setMode("dark")}>
                         <DarkModeIcon />
                    </IconButton>   
                )}
                

                </Box>
            </Toolbar>
            </AppBar>
        );
};

export default Header;