// src/components/AddLeadModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";

export default function AddLeadModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name) return alert("Lead name is required");
    onSave(form);
    setForm({ name: "", company: "", email: "", phone: "", status: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Lead</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Lead Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Company" name="company" value={form.company} onChange={handleChange} />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <TextField label="Status" name="status" value={form.status} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
