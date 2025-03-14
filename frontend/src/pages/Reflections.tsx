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
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mic as MicIcon,
  Stop as StopIcon,
} from '@mui/icons-material';

interface Reflection {
  id: number;
  transcription: string;
  ai_summary: string;
  keywords: string[];
  created_at: string;
}

const Reflections: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogAction, setDialogAction] = useState<'create' | 'edit'>('create');

  // TODO: Replace with actual data from Redux store
  const mockReflections: Reflection[] = [
    {
      id: 1,
      transcription: 'Today I made significant progress on the project...',
      ai_summary: 'Positive reflection about project progress',
      keywords: ['project', 'progress', 'achievement'],
      created_at: '2024-12-22T10:30:00Z',
    },
    {
      id: 2,
      transcription: 'I learned about new React patterns and best practices...',
      ai_summary: 'Learning experience with React development',
      keywords: ['learning', 'React', 'development'],
      created_at: '2024-12-21T15:45:00Z',
    },
  ];

  const handleOpenDialog = (action: 'create' | 'edit', reflection?: Reflection) => {
    setDialogAction(action);
    setDialogTitle(action === 'create' ? 'Record New Reflection' : 'Edit Reflection');
    setSelectedReflection(reflection || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReflection(null);
    setIsRecording(false);
  };

  const handleSaveReflection = () => {
    // TODO: Implement save logic with Redux
    handleCloseDialog();
  };

  const handleDeleteReflection = (reflectionId: number) => {
    // TODO: Implement delete logic with Redux
    console.log('Delete reflection:', reflectionId);
  };

  const toggleRecording = () => {
    // TODO: Implement actual audio recording logic
    setIsRecording(!isRecording);
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Reflections</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            New Reflection
          </Button>
        </Box>

        <Grid container spacing={3}>
          {mockReflections.map((reflection) => (
            <Grid item xs={12} md={6} key={reflection.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {new Date(reflection.created_at).toLocaleString()}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('edit', reflection)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReflection(reflection.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {reflection.transcription}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {reflection.ai_summary}
                  </Typography>
                  <Box>
                    {reflection.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {dialogAction === 'create' ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <IconButton
                    color={isRecording ? 'error' : 'primary'}
                    onClick={toggleRecording}
                    sx={{ width: 80, height: 80 }}
                  >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                  </IconButton>
                  {isRecording && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography>Recording...</Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={selectedReflection?.transcription || ''}
                  label="Reflection"
                  margin="normal"
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSaveReflection}
              variant="contained"
              disabled={dialogAction === 'create' && !isRecording}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Reflections;