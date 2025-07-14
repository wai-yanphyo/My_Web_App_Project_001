import {
 Box,
 Drawer,
 Divider,
 List,
 ListItem,
 ListItemButton,
 ListItemIcon,
 ListItemText,
 Avatar,
 Typography,
 } from "@mui/material";

 import HowToRegIcon from '@mui/icons-material/HowToReg';
 


 
 import {
  Home as HomeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
 } from "@mui/icons-material";

 

 import { deepPurple } from "@mui/material/colors";
 import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from "react";
import { useApp } from '../ThemedApp';


 import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
 import useAuth from '../hooks/useAuth';


 
const AppDrawer=()=> {
    
        const { user, handleLogout } = useAuth();
         const {showDrawer, setShowDrawer }=useApp();

         console.log(user?.rolee)
            return (
                    <div>
                    <Drawer
                        open={showDrawer}
                        onClose={() => setShowDrawer(false)}>
                        <Box
                        sx={{
                            mb: 6,
                            width: 300,
                            height: 140,
                            bgcolor: "banner",
                            position: "relative",
                        }}>

                        <Box
                            sx={{
                            gap: 2,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            left: 20,
                            bottom: -30,
                            }}>
                            <Avatar
                            sx={{
                                width: 94,
                                height: 94,
                                color: "white",
                                background: deepPurple[500],
                            }}
                            />
                           <Typography sx={{ fontWeight: "bold" }}>
                            {user?.email ? user.email.split("@")[0] : 'Guest'}
                            </Typography>
                        </Box>
                        </Box>

                       

                        <List>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/">
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Properties" />
                                </ListItemButton>
                            </ListItem>

                            {user?.role === 'ADMIN' && (
                            <>
                                <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admindashboard">
                                    <ListItemIcon>
                                    <AdminPanelSettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Admin Panel" />
                                </ListItemButton>
                                </ListItem>
                            </>
                            )}
                        
                            {user ? (
                                
                                <>
                                    <ListItem disablePadding>
                                             <ListItemText primary={`Hello, ${user?.email || 'Guest'}`} sx={{ ml: 2, py: 1 }} />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleLogout}>
                                            <ListItemIcon>
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Logout" />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            ) : (
                                            
                            <>

                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/login">
                                    <ListItemIcon>
                                        <LoginIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>

                            {/* Register Link */}
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/register">
                                    <ListItemIcon>
                                        <HowToRegIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>              
                                            
                           </>
                            
                            )}
                        </List>

                    </Drawer>
                    </div>
                );
    };

export default AppDrawer;