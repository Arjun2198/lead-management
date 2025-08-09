// src/pages/LeadsPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import AddLeadModal from "../components/AddLeadModal";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch logged-in user's role and team
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Fetch leads based on role
  useEffect(() => {
    const fetchLeads = async () => {
      if (!userData) return;

      let leadsArray = [];

      if (userData.role === "Admin") {
        // Admin → All leads
        const snap = await getDocs(collection(db, "leads"));
        leadsArray = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } 
      else if (userData.role === "Manager") {
        // Manager → Own + Team
        const allowedIds = [currentUser.uid, ...(userData.team || [])];
        if (allowedIds.length > 10) {
          console.warn("Firestore 'in' queries support max 10 IDs at once.");
        }
        const q = query(collection(db, "leads"), where("ownerId", "in", allowedIds));
        const snap = await getDocs(q);
        leadsArray = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } 
      else if (userData.role === "USER") {
        // User → Only own
        const q = query(collection(db, "leads"), where("ownerId", "==", currentUser.uid));
        const snap = await getDocs(q);
        leadsArray = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      setLeads(leadsArray);
      setFilteredLeads(leadsArray);
    };

    fetchLeads();
  }, [userData, currentUser]);

  // Search filter
  useEffect(() => {
    const results = leads.filter((lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLeads(results);
  }, [search, leads]);

  // Save new lead
  const handleSaveLead = async (leadData) => {
    if (!userData) return;

    const newLead = {
      ...leadData,
      ownerId: currentUser.uid,
      managerId: userData.role === "USER" ? userData.managerId || null : currentUser.uid,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "leads"), newLead);
    setLeads([...leads, { id: docRef.id, ...newLead }]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leads
      </Typography>

      {/* Search + Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Search Leads"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: "200px",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        />

        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Lead
        </Button>
      </Box>

      {/* Leads Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Follow-up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => alert(`Follow-up for ${lead.name}`)}
                  >
                    Add Follow-up
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Lead Modal */}
      <AddLeadModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveLead}
      />
    </Box>
  );
}
