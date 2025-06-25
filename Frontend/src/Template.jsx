import { Box, Container } from "@mui/material";


 import Header from "./components/Header";
 import AppDrawer from "./components/AppDrawer";
 import LoginPage from "./pages/LoginPage";


 export default function Template() {

    return (
    <Box>
        
      <Header />
      <AppDrawer />
      <LoginPage />

      
      
      
    </Box>
  );
 }