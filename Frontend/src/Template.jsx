import { Box, Container } from "@mui/material";


 import Header from "./components/Header";
 import AppDrawer from "./components/AppDrawer";
 import LoginPage from "./pages/LoginPage";
  import RegisterPage from "./pages/RegisterPage";



 export default function Template() {

    return (
    <Box>
        
      <Header />
      <AppDrawer />
      {/* <LoginPage /> */}
      <RegisterPage />

      
      
      
    </Box>
  );
 }