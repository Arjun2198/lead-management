import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [teamMembers, setTeamMembers] = useState("");

  // Fetch Users
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map((docSnap) => {
      const u = docSnap.data();
      return {
        id: docSnap.id,
        name: u.name || u.displayName || "",
        email: u.email || "",
        role: u.role || "",
        teamMembers: Array.isArray(u.teamMembers) ? u.teamMembers.join(", ") : "-"
      };
    });
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter for search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  // Open modal
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setTeamMembers(user.teamMembers);
    } else {
      setEditUser(null);
      setName("");
      setEmail("");
      setRole("User");
      setTeamMembers("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Save user
  const handleSaveUser = async () => {
    const payload = {
      ...(role === "Admin" ? { displayName: name } : { name }),
      email,
      role,
      teamMembers: role === "Manager" ? teamMembers.split(",").map((m) => m.trim()) : []
    };

    if (editUser) {
      await updateDoc(doc(db, "users", editUser.id), payload);
      setSnackbar({ open: true, message: `User "${name}" updated successfully!`, severity: "success" });
    } else {
      await addDoc(collection(db, "users"), payload);
      setSnackbar({ open: true, message: `User "${name}" added successfully!`, severity: "success" });
    }

    fetchUsers();
    handleCloseModal();
  };

  // Delete user
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Sure to delete user: ${user.name}`)) {
      await deleteDoc(doc(db, "users", user.id));
      setSnackbar({ open: true, message: `User "${user.name}" deleted successfully!`, severity: "success" });
      fetchUsers();
    }
  };

  // Table columns
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "teamMembers", headerName: "Team Members", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.role === "Admin" ? null : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpenModal(params.row)}
              sx={{
                borderColor: "#1F3A5F",
                color: "#1F3A5F",
                "&:hover": { backgroundColor: "#1F3A5F", color: "#fff" }
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteUser(params.row)}
            >
              Delete
            </Button>
          </Box>
        )
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        User Management
      </Typography>

      {/* Search + Add */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          placeholder="Search users..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          sx={{
            backgroundColor: "#1F3A5F",
            "&:hover": { backgroundColor: "#163054" },
            borderRadius: "8px",
            paddingX: 3
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Table inside glassmorphism card */}
      <Card
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.8)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
          borderRadius: "12px"
        }}
      >
        <CardContent>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>

          {role === "Manager" && (
            <TextField
              label="Team Members (comma separated)"
              variant="outlined"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
