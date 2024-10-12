import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ManageUsersModal from '../Components/ManageUsersModal'; // Separate file for Manage Users Modal
import ManageBookingsModal from '../Components/ManageBookingsModal'; // Separate file for Manage Bookings Modal
<<<<<<< HEAD
=======
import ManagePackagesModal from '../Components/ManagePackagesModal'; // Separate file for Manage Packages Modal
>>>>>>> main

function AdminPanel() {
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
<<<<<<< HEAD
=======
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);

>>>>>>> main

  const handleUsersModalOpen = () => {
    setIsUsersModalOpen(true);
  };

  const handleUsersModalClose = () => {
    setIsUsersModalOpen(false);
  };

  const handleBookingsModalOpen = () => {
    setIsBookingsModalOpen(true);
  };

  const handleBookingsModalClose = () => {
    setIsBookingsModalOpen(false);
  };

<<<<<<< HEAD
=======
  const handlePackagesModalOpen = () => {
    setIsPackagesModalOpen(true);
  };

  const handlePackagesModalClose = () => {
    setIsPackagesModalOpen(false);
  };

>>>>>>> main
  return (
    <Box sx={{ padding: '40px', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>What would you like to do?</Typography>

      <Button variant="contained" sx={{ margin: '20px' }} onClick={handleUsersModalOpen}>
        Manage Users
      </Button>

      <Button variant="contained" sx={{ margin: '20px' }} onClick={handleBookingsModalOpen}>
        Manage Bookings
      </Button>

<<<<<<< HEAD
=======
      <Button variant="contained" sx={{ margin: '20px' }} onClick={handlePackagesModalOpen}>
        Manage Packages
      </Button>

>>>>>>> main
      {/* Manage Users Modal */}
      <ManageUsersModal open={isUsersModalOpen} onClose={handleUsersModalClose} />

      {/* Manage Bookings Modal */}
      <ManageBookingsModal open={isBookingsModalOpen} onClose={handleBookingsModalClose} />
<<<<<<< HEAD
=======

      {/* Manage Packages Modal */}
      <ManagePackagesModal open={isPackagesModalOpen} onClose={handlePackagesModalClose} />
>>>>>>> main
    </Box>
  );
}

export default AdminPanel;
