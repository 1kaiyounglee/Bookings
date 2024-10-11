import React, { useState, useEffect } from 'react';
import { getPackagesGeneral, getUsers, getBookings, } from '../HelperFunctions/GetDatabaseModels';
import {updateAdmin, updateBooking} from '../HelperFunctions/SendData';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch users and bookings
  useEffect(() => {
    async function fetchData() {
      const usersData = await getUsers();
      const bookingsData = await getBookings();
      setUsers(usersData);
      setBookings(bookingsData);
    }
    fetchData();
  }, []);

  // Toggle admin status for a user
  const handleAdminStatusChange = async (email, newStatus) => {
    await updateAdmin(email, newStatus);
    const updatedUsers = users.map(user =>
      user.email === email ? { ...user, is_admin: newStatus } : user
    );
    setUsers(updatedUsers);
  };

  // Update booking status
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    await updateBooking(bookingId, { status: newStatus });
    const updatedBookings = bookings.map(booking =>
      booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Panel</Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>Manage Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Admin Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.email}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>
                <Select
                  value={user.is_admin}
                  onChange={e => handleAdminStatusChange(user.email, e.target.value)}
                >
                  <MenuItem value={true}>Admin</MenuItem>
                  <MenuItem value={false}>User</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Manage Bookings</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Package ID</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.booking_id}>
              <TableCell>{booking.email}</TableCell>
              <TableCell>{booking.package_id}</TableCell>
              <TableCell>{booking.start_date}</TableCell>
              <TableCell>{booking.end_date}</TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onChange={e => handleBookingStatusChange(booking.booking_id, e.target.value)}
                >
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default AdminPanel;
