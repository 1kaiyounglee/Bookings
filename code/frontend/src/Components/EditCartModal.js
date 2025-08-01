import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import addDays from 'date-fns/addDays';

const EditPackageModal = ({ open, onClose, item, handleUpdateItem}) => {
  // Convert dates to Date objects if they are strings
  const [startDate, setStartDate] = useState(new Date(item.startDate));
  const [endDate, setEndDate] = useState(new Date(item.endDate));
  const [travellers, setTravellers] = useState(item.travellers);

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    if (item && item.duration) {
      const calculatedEndDate = addDays(newStartDate, item.duration);
      setEndDate(calculatedEndDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    if (item && item.duration) {
      const calculatedStartDate = addDays(newEndDate, -item.duration);
      setStartDate(calculatedStartDate);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Package : {item.packageName}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '175px' }}>
        <TextField
          label="Number of Travellers"
          type="number"
          fullWidth
          value={travellers}
          onChange={(e) => setTravellers(e.target.value)}
          sx={{ mb: 2 }}
        />
       
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>  
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
            disablePast
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
            disablePast
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ minWidth: '150px' }}
        >
          CANCEL
        </Button>
        <Button
          onClick={() => handleUpdateItem(item, startDate, endDate, travellers)}
          variant="contained"
          color="primary"
          sx={{ minWidth: '150px' }}
        >
          SAVE CHANGES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPackageModal;
