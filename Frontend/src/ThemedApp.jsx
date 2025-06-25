import AppDrawer from "./components/AppDrawer";
import PropertyListPage from './pages/PropertyListPage';

 import PropertyFormPage from './pages/PropertyFormPage';
 import LoginPage from './pages/LoginPage';
 import RegisterPage from './pages/RegisterPage';


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

import { 
  createBrowserRouter, 
  RouterProvider, 
} from "react-router-dom";





const AppContext = createContext();

 export function useApp() {
    return useContext(AppContext);
 }

 

// ===================Create Router=============

const router=createBrowserRouter([
    {
        path: "/",
        element:<Template />,
        children: [
            {
                path : "/",
                element: <PropertyListPage />,
            },
            {
            path: "/login",
            element: <LoginPage />,
            },
            {
            path: "/register",
            element: <RegisterPage />,
            },
            {
            path:"properties/edit/:id",
            element: <PropertyFormPage />,
            },
            {
            path:"/properties/new",
            element: <PropertyFormPage />,
            },
            

        ],

    },
 ]);

// ===================Router===============



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
            
            {/* Replce with route at <Template /> */}
            <RouterProvider router={router} />  
            <CssBaseline />
            
        
    
        
            </AppContext.Provider>
        </ThemeProvider>
    
        
        
    );
 }

 export default ThemedApp;

