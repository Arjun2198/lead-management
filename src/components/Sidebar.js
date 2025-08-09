// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [role, setRole] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
    };
    fetchRole();
  }, [currentUser]);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Leads", icon: <PeopleIcon />, path: "/leads" },
  ];

  if (role === "Admin") {
    menuItems.push({
      text: "User Management",
      icon: <AdminPanelSettingsIcon />,
      path: "/users",
    });
  }

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? theme.palette.secondary.main + "20"
                  : "transparent",
              borderRadius: theme.shape.borderRadius,
              m: 0.5,
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
