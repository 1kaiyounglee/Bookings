import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { getUsers } from '../HelperFunctions/GetDatabaseModels.js';
import { updateAdmin } from '../HelperFunctions/SendData.js';


function ManageUsersModal({ open, onClose }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleUserChange = (event) => {
    const selected = event.target.value;
    const user = users.find(u => u.email === selected);
    setSelectedUser(selected);
    setIsAdmin(user.is_admin); // Set admin status based on the user
  };

  const handleAdminToggle = async () => {
    await updateAdmin(selectedUser, !isAdmin);
    setIsAdmin(!isAdmin); // Toggle admin status
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: '20px', backgroundColor: 'white', width: '400px', margin: '100px auto' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>Manage Users</Typography>

        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel>Select User</InputLabel>
          <Select value={selectedUser} onChange={handleUserChange}>
            {users.map((user) => (
              <MenuItem 
                key={user.email} 
                value={user.email} 
                sx={{ color: user.is_admin ? 'green' : 'red' }} // Color-code admins green, others red
              >
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          onClick={handleAdminToggle} 
          sx={{ backgroundColor: isAdmin ? 'green' : 'red' }}
        >
          {isAdmin ? 'Revoke Admin' : 'Make Admin'}
        </Button>
      </Box>
    </Modal>
  );
}

export default ManageUsersModal;
