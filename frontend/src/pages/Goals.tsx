import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'in_progress' | 'completed';
  target_date?: string;
  category?: string;
  recurring: boolean;
}

const Goals: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogAction, setDialogAction] = useState<'create' | 'edit'>('create');

  // TODO: Replace with actual data from Redux store
  const mockGoals: Goal[] = [
    {
      id: 1,
      title: 'Learn React',
      description: 'Master React and its ecosystem',
      status: 'in_progress',
      target_date: '2024-12-31',
      category: 'Learning',
      recurring: false,
    },
    {
      id: 2,
      title: 'Exercise daily',
      description: '30 minutes of exercise every day',
      status: 'completed',
      category: 'Health',
      recurring: true,
    },
  ];

  const handleOpenDialog = (action: 'create' | 'edit', goal?: Goal) => {
    setDialogAction(action);
    setDialogTitle(action === 'create' ? 'Create New Goal' : 'Edit Goal');
    setSelectedGoal(goal || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
  };

  const handleSaveGoal = () => {
    // TODO: Implement save logic with Redux
    handleCloseDialog();
  };

  const handleDeleteGoal = (goalId: number) => {
    // TODO: Implement delete logic with Redux
    console.log('Delete goal:', goalId);
  };

  const handleToggleStatus = (goalId: number) => {
    // TODO: Implement status toggle logic with Redux
    console.log('Toggle status:', goalId);
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Goals</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Add Goal
          </Button>
        </Box>

        <Grid container spacing={3}>
          {mockGoals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                      {goal.title}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(goal.id)}
                      >
                        {goal.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <UncheckedIcon />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('edit', goal)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {goal.description}
                  </Typography>
                  {goal.category && (
                    <Chip
                      label={goal.category}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {goal.recurring && (
                    <Chip label="Recurring" size="small" sx={{ mb: 1 }} />
                  )}
                  {goal.target_date && (
                    <Typography variant="caption" display="block">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={selectedGoal?.title || ''}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedGoal?.description || ''}
                margin="normal"
                multiline
                rows={3}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedGoal?.category || ''}
                  label="Category"
                >
                  <MenuItem value="Learning">Learning</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Career">Career</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Target Date"
                  value={selectedGoal?.target_date ? new Date(selectedGoal.target_date) : null}
                  sx={{ mt: 2, width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveGoal} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Goals;