import { Box, Container } from "@mui/material";


 import Header from "./components/Header";
 import AppDrawer from "./components/AppDrawer";
 import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import PropertyListPage from "./pages/PropertyListPage";
import { Outlet } from "react-router-dom";



 export default function Template() {

    return (
    <Box>
        
      <Header />
      <AppDrawer />
       
      {/* <LoginPage />
      <RegisterPage />
      <PropertyFormPage/>
      < PropertyListPage /> */}

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Outlet />
      </Container>

      
      
      
    </Box>
  );
 }