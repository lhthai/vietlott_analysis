import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search, CalendarToday, Tag } from '@mui/icons-material';

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const rowsPerPage = 20;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/power655.jsonl');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        
        const text = await response.text();
        const lines = text.trim().split('\n');
        const parsedData = lines.map(line => JSON.parse(line));
        
        // Sort by date (newest first)
        parsedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setData(parsedData);
        setFilteredData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm)
    );
    setFilteredData(filtered);
    setPage(1);
  }, [searchTerm, data]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getNumberColor = (number, index) => {
    if (index === 6) {
      return 'error'; // Special number
    }
    if (number <= 10) return 'primary';
    if (number <= 20) return 'secondary';
    if (number <= 30) return 'success';
    if (number <= 40) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Vietlott Power 6/55 History
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Total draws: {filteredData.length}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by ID or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Tag sx={{ mr: 1 }} />
                  Draw ID
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <CalendarToday sx={{ mr: 1 }} />
                  Date
                </Box>
              </TableCell>
              <TableCell>Numbers</TableCell>
              <TableCell>Special Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    #{row.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(row.date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {row.result.slice(0, 6).map((number, index) => (
                      <Chip
                        key={index}
                        label={number.toString().padStart(2, '0')}
                        size="small"
                        color={getNumberColor(number, index)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.result[6].toString().padStart(2, '0')}
                    size="small"
                    color="error"
                    variant="filled"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredData.length > rowsPerPage && (
        <Box display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default History; 