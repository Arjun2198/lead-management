import React from "react";
import { AppBar, Toolbar, Typography, IconButton, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ onMenuClick }) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap>
          Lead Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
