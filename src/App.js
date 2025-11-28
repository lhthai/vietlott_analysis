import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab
} from '@mui/material';
import { BarChart, TrendingUp, Analytics, History as HistoryIcon } from '@mui/icons-material';
import History from './components/History';
import NumberAnalysis655 from './components/NumberAnalysis655';
import NumberAnalysis645 from './components/NumberAnalysis645';
import History645 from './components/History645';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Vietlott Statistics
            </Typography>

            <Typography variant="body1" paragraph>
              This is your React app with MUI v7 setup. You can now start building your Vietlott statistics application.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" component="div">
                    Data Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyze Vietlott lottery data and trends
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Analytics sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h6" component="div">
                    Statistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View detailed statistics and patterns
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <BarChart sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6" component="div">
                    Charts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualize data with interactive charts
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="warning"
                sx={{ mr: 2 }}
                onClick={() => setCurrentTab(1)}
              >
                Power 6/45 History
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setCurrentTab(2)}
              >
                Power 6/55 History
              </Button>             
            </Box>
            <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 2 }}
                  onClick={() => setCurrentTab(3)}
                >
                  Power 6/45 Analysis
                </Button>
                <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setCurrentTab(4)}
              >
                Power 6/55 Analysis
              </Button>
              </Box>
          </Container>
        );
      case 1:
        return <History645 />;
      case 2:
        return <History />;
      case 3:
        return <NumberAnalysis645 />;
      case 4:
        return <NumberAnalysis655 />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <BarChart sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Vietlott Statistics
            </Typography>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    color: 'white'
                  }
                }
              }}
            >
              <Tab label="Dashboard" />
              <Tab label="6/45 History" />
              <Tab label="6/55 History" />
              <Tab label="6/45 Analysis" />
              <Tab label="6/55 Analysis" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {renderContent()}
      </Box>
    </ThemeProvider>
  );
}

export default App;
