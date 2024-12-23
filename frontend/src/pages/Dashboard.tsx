import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assignment as GoalsIcon,
  RecordVoiceOver as ReflectionsIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // TODO: Replace with actual data from Redux store
  const mockData = {
    goals: {
      total: 5,
      completed: 2,
      recent: [
        { id: 1, title: 'Learn React', status: 'in_progress' },
        { id: 2, title: 'Exercise daily', status: 'completed' },
        { id: 3, title: 'Read more books', status: 'in_progress' },
      ],
    },
    reflections: {
      total: 8,
      recent: [
        { id: 1, date: '2024-12-22', summary: 'Today was productive...' },
        { id: 2, date: '2024-12-21', summary: 'Made progress on...' },
        { id: 3, date: '2024-12-20', summary: 'Learned about...' },
      ],
    },
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Goals Summary Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GoalsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Goals</Typography>
                </Box>
                <Typography variant="body1" gutterBottom>
                  Total Goals: {mockData.goals.total}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Completed: {mockData.goals.completed}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Recent Goals:
                </Typography>
                <List>
                  {mockData.goals.recent.map((goal) => (
                    <React.Fragment key={goal.id}>
                      <ListItem>
                        <ListItemText
                          primary={goal.title}
                          secondary={goal.status === 'completed' ? 'Completed' : 'In Progress'}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/goals')}
                  sx={{ mt: 2 }}
                >
                  Manage Goals
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Reflections Summary Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReflectionsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Reflections</Typography>
                </Box>
                <Typography variant="body1" gutterBottom>
                  Total Reflections: {mockData.reflections.total}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Recent Reflections:
                </Typography>
                <List>
                  {mockData.reflections.recent.map((reflection) => (
                    <React.Fragment key={reflection.id}>
                      <ListItem>
                        <ListItemText
                          primary={new Date(reflection.date).toLocaleDateString()}
                          secondary={reflection.summary}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/reflections')}
                  sx={{ mt: 2 }}
                >
                  View All Reflections
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;