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
import { useState } from "react";
 
 
    const AppDrawer=()=> {
        
        const { user, handleLogout } = true;
        const [showDrawer, setShowDrawer]= useState(true);
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
                            Wai Yan Phyo
                            </Typography>
                        </Box>

                        </Box>

                       

                        <List>
                            {/* Properties Link to see my properties */}
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Properties" />
                                </ListItemButton>
                            </ListItem>
                        
                            {user ? (
                                
                                <>
                                    {/* user eamil dispaly text */}
                                    <ListItem disablePadding>
                                        <ListItemText primary={`Hello Wai Yan`} sx={{ ml: 2, py: 1 }} />
                                    </ListItem>
                                    {/* Logout Button */}
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
                            
                            {/* can go eaily to login page by clicking on it */}
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LoginIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>

                            {/* Register Link */}
                            <ListItem disablePadding>
                                <ListItemButton >
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