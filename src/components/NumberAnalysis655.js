import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Analytics, TrendingUp, Numbers } from '@mui/icons-material';

const NumberAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topFiveCombinations, setTopCombinations] = useState([]);
  const [topFourCombinations, setTopFourCombinations] = useState([]);
  const [topThreeCombinations, setTopThreeCombinations] = useState([]);
  const [numberFrequency, setNumberFrequency] = useState({});

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

        setData(parsedData);
        analyzeData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const analyzeData = (data) => {
    // Count individual number frequency
    const numberCount = {};

    // Count 5-number combinations
    const fiveCombinationCount = {};

    // Count 4-number combinations
    const fourCombinationCount = {};

    // Count 3-number combinations
    const threeCombinationCount = {};

    data.forEach(draw => {
      const numbers = draw.result.slice(0, 6); // Only main numbers, exclude special number

      // Count individual numbers
      numbers.forEach(num => {
        numberCount[num] = (numberCount[num] || 0) + 1;
      });

      // Generate all 5-number combinations from the 6 numbers
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          for (let k = j + 1; k < numbers.length; k++) {
            for (let l = k + 1; l < numbers.length; l++) {
              for (let m = l + 1; m < numbers.length; m++) {
                const combination = [numbers[i], numbers[j], numbers[k], numbers[l], numbers[m]]
                  .sort((a, b) => a - b);
                const key = combination.join(',');
                fiveCombinationCount[key] = (fiveCombinationCount[key] || 0) + 1;
              }
            }
          }
        }
      }

      // Generate all 4-number combinations from the 6 numbers
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          for (let k = j + 1; k < numbers.length; k++) {
            for (let l = k + 1; l < numbers.length; l++) {
              const combination = [numbers[i], numbers[j], numbers[k], numbers[l]]
                .sort((a, b) => a - b);
              const key = combination.join(',');
              fourCombinationCount[key] = (fourCombinationCount[key] || 0) + 1;
            }
          }
        }
      }

      // Generate all 3-number combinations from the 6 numbers
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          for (let k = j + 1; k < numbers.length; k++) {
            const combination = [numbers[i], numbers[j], numbers[k]]
              .sort((a, b) => a - b);
            const key = combination.join(',');
            threeCombinationCount[key] = (threeCombinationCount[key] || 0) + 1;
          }
        }
      }
    });

    // Get top 10 5-number combinations
    const sortedCombinations = Object.entries(fiveCombinationCount)
      .map(([combination, count]) => ({
        numbers: combination.split(',').map(Number),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top 10 4-number combinations
    const sortedFourCombinations = Object.entries(fourCombinationCount)
      .map(([combination, count]) => ({
        numbers: combination.split(',').map(Number),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top 10 3-number combinations
    const sortedThreeCombinations = Object.entries(threeCombinationCount)
      .map(([combination, count]) => ({
        numbers: combination.split(',').map(Number),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setTopCombinations(sortedCombinations);
    setTopFourCombinations(sortedFourCombinations);
    setTopThreeCombinations(sortedThreeCombinations);
    setNumberFrequency(numberCount);
  };

  const getNumberColor = (number) => {
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

  // Get top 10 most frequent individual numbers
  const topNumbers = Object.entries(numberFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([number, count]) => ({ number: parseInt(number), count }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Number Analysis
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Analysis of {data.length} draws from Vietlott Power 6/55
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Top 10 Most Frequent Individual Numbers */}
        <Grid size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Numbers sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Most Frequent Individual Numbers
                </Typography>
              </Box>

              <List>
                {topNumbers.map((item, index) => (
                  <React.Fragment key={item.number}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={item.number.toString().padStart(2, '0')}
                              size="small"
                              color={getNumberColor(item.number)}
                              variant="outlined"
                            />
                            <Typography variant="body2">
                              appeared {item.count} times
                            </Typography>
                          </Box>
                        }
                        secondary={`Rank #${index + 1}`}
                      />
                    </ListItem>
                    {index < topNumbers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 10 Most Frequent 3-Number Combinations */}
        <Grid size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Analytics sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">
                  Most Frequent 3-Number Combinations
                </Typography>
              </Box>

              <List>
                {topThreeCombinations.map((combination, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            {combination.numbers.map((number, numIndex) => (
                              <Chip
                                key={numIndex}
                                label={number.toString().padStart(2, '0')}
                                size="small"
                                color={getNumberColor(number)}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        }
                        secondary={`Appeared ${combination.count} times`}
                      />
                    </ListItem>
                    {index < topThreeCombinations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 10 Most Frequent 4-Number Combinations */}
        <Grid size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Analytics sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">
                  Most Frequent 4-Number Combinations
                </Typography>
              </Box>

              <List>
                {topFourCombinations.map((combination, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            {combination.numbers.map((number, numIndex) => (
                              <Chip
                                key={numIndex}
                                label={number.toString().padStart(2, '0')}
                                size="small"
                                color={getNumberColor(number)}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        }
                        secondary={`Appeared ${combination.count} times`}
                      />
                    </ListItem>
                    {index < topFourCombinations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Top 10 Most Frequent 5-Number Combinations */}

        <Grid size={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Analytics sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Most Frequent 5-Number Combinations
                </Typography>
              </Box>

              <List>
                {topFiveCombinations.map((combination, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            {combination.numbers.map((number, numIndex) => (
                              <Chip
                                key={numIndex}
                                label={number.toString().padStart(2, '0')}
                                size="small"
                                color={getNumberColor(number)}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        }
                        secondary={`Appeared ${combination.count} times`}
                      />
                    </ListItem>
                    {index < topFiveCombinations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6">
              Analysis Summary
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total Draws Analyzed
              </Typography>
              <Typography variant="h6" color="primary">
                {data.length}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Most Frequent Number
              </Typography>
              <Typography variant="h6" color="secondary">
                {topNumbers[0]?.number.toString().padStart(2, '0')} ({topNumbers[0]?.count} times)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Most Frequent 3-Number Combo
              </Typography>
              <Typography variant="h6" color="warning.main">
                {topThreeCombinations[0]?.count} times
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Most Frequent 4-Number Combo
              </Typography>
              <Typography variant="h6" color="info.main">
                {topFourCombinations[0]?.count} times
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Most Frequent 5-Number Combo
              </Typography>
              <Typography variant="h6" color="success.main">
                {topFiveCombinations[0]?.count} times
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NumberAnalysis; 