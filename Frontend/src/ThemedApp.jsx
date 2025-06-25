import AppDrawer from "./components/AppDrawer";


//import { useState, createContext } from "react"
import { useState, createContext, useContext, useMemo } from "react";
import { deepPurple, grey } from "@mui/material/colors";
 import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Snackbar,
 } from "@mui/material";

 

 import Template from "./Template";





const AppContext = createContext();

 export function useApp() {
    return useContext(AppContext);
 }

 


const ThemedApp=()=> {
const [showDrawer, setShowDrawer] = useState(false);
const [globalMsg, setGlobalMsg] = useState(null);
const [auth, setAuth] = useState(null);
const [mode, setMode] = useState("light");  //dark


    const theme= useMemo(()=>{
        return createTheme({
            palette: {mode},
            
        });
    },[mode]);

    return (
        
        
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ showDrawer, setShowDrawer,mode, setMode, }}>
            
            <Template />
            <CssBaseline />
            
        
    
        
            </AppContext.Provider>
        </ThemeProvider>
    
        
        
    );
 }

 export default ThemedApp;

