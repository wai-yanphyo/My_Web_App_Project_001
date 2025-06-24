const  Header=()=> {

        return (
            <AppBar position="static">
            <Toolbar>
                <IconButton
                color="inherit"
                edge="start"
                 onClick={()=>{}}>
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