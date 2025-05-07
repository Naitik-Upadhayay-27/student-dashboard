import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  NoteAdd,
  Bookmark,
  BookmarkBorder,
  Label
} from '@mui/icons-material';
import mockApi from '../../services/mockApi';
// Using native JavaScript Date methods instead of date-fns

const NOTE_CATEGORIES = [
  { value: 'academic', label: 'Academic', color: 'primary' },
  { value: 'behavior', label: 'Behavior', color: 'warning' },
  { value: 'attendance', label: 'Attendance', color: 'error' },
  { value: 'achievement', label: 'Achievement', color: 'success' },
  { value: 'general', label: 'General', color: 'default' }
];

// Helper function to format dates
const formatDate = (date, formatStr) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

const StudentNotes = ({ studentId, studentName }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({
    content: '',
    category: 'general',
    important: false
  });
  const [editingNote, setEditingNote] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch student notes when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student = await mockApi.getStudents().then(
          students => students.find(s => s.id === studentId)
        );
        
        if (student && student.notes) {
          setNotes(student.notes);
        }
      } catch (error) {
        console.error('Error fetching student notes:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load notes. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Handle input change for new note
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  // Handle toggling important flag
  const handleToggleImportant = () => {
    setNewNote(prev => ({ ...prev, important: !prev.important }));
  };

  // Handle adding a new note
  const handleAddNote = async () => {
    if (!newNote.content.trim()) return;

    try {
      const addedNote = await mockApi.addStudentNote(studentId, newNote);
      setNotes(prev => [...prev, addedNote]);
      setNewNote({
        content: '',
        category: 'general',
        important: false
      });
      setSnackbar({
        open: true,
        message: 'Note added successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding note:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add note. Please try again.',
        severity: 'error'
      });
    }
  };

  // Handle opening edit mode for a note
  const handleEditNote = (note) => {
    setEditingNote({
      ...note,
      newContent: note.content,
      newCategory: note.category,
      newImportant: note.important
    });
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  // Handle saving edited note
  const handleSaveEdit = async () => {
    if (!editingNote.newContent.trim()) return;

    try {
      // Find the note index
      const noteIndex = notes.findIndex(note => note.id === editingNote.id);
      
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      // Create updated note
      const updatedNote = {
        ...notes[noteIndex],
        content: editingNote.newContent,
        category: editingNote.newCategory,
        important: editingNote.newImportant,
        updatedAt: new Date().toISOString()
      };
      
      // Update notes array
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = updatedNote;
      
      // Update student notes in mock API
      await mockApi.addStudentNote(studentId, updatedNote);
      
      setNotes(updatedNotes);
      setEditingNote(null);
      setSnackbar({
        open: true,
        message: 'Note updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating note:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update note. Please try again.',
        severity: 'error'
      });
    }
  };

  // Handle opening delete dialog
  const handleOpenDeleteDialog = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  // Handle closing delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  // Handle deleting a note
  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await mockApi.deleteStudentNote(studentId, noteToDelete.id);
      setNotes(prev => prev.filter(note => note.id !== noteToDelete.id));
      setSnackbar({
        open: true,
        message: 'Note deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete note. Please try again.',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get category color
  const getCategoryColor = (category) => {
    const foundCategory = NOTE_CATEGORIES.find(cat => cat.value === category);
    return foundCategory ? foundCategory.color : 'default';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <NoteAdd sx={{ mr: 1 }} />
          Notes for {studentName}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Add new note form */}
        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Add New Note
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Enter your note here..."
              name="content"
              value={newNote.content}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="note-category-label">Category</InputLabel>
                <Select
                  labelId="note-category-label"
                  id="note-category"
                  name="category"
                  value={newNote.category}
                  onChange={handleInputChange}
                  label="Category"
                  size="small"
                >
                  {NOTE_CATEGORIES.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Label sx={{ mr: 1, color: `${category.color}.main` }} />
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Tooltip title={newNote.important ? "Mark as Regular" : "Mark as Important"}>
                <IconButton onClick={handleToggleImportant} color={newNote.important ? "primary" : "default"}>
                  {newNote.important ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNote}
                disabled={!newNote.content.trim()}
                sx={{ ml: 'auto' }}
              >
                Add Note
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {/* Notes list */}
        <Typography variant="subtitle1" gutterBottom>
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
        </Typography>
        
        {notes.length > 0 ? (
          <List>
            {notes.map((note) => (
              <React.Fragment key={note.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: note.important ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    borderRadius: 1,
                    border: note.important ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
                    mb: 1
                  }}
                >
                  {editingNote && editingNote.id === note.id ? (
                    // Edit mode
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        value={editingNote.newContent}
                        onChange={(e) => setEditingNote(prev => ({ ...prev, newContent: e.target.value }))}
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 150 }}>
                          <InputLabel id="edit-note-category-label">Category</InputLabel>
                          <Select
                            labelId="edit-note-category-label"
                            id="edit-note-category"
                            value={editingNote.newCategory}
                            onChange={(e) => setEditingNote(prev => ({ ...prev, newCategory: e.target.value }))}
                            label="Category"
                            size="small"
                          >
                            {NOTE_CATEGORIES.map(category => (
                              <MenuItem key={category.value} value={category.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Label sx={{ mr: 1, color: `${category.color}.main` }} />
                                  {category.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Tooltip title={editingNote.newImportant ? "Mark as Regular" : "Mark as Important"}>
                          <IconButton 
                            onClick={() => setEditingNote(prev => ({ ...prev, newImportant: !prev.newImportant }))}
                            color={editingNote.newImportant ? "primary" : "default"}
                          >
                            {editingNote.newImportant ? <Bookmark /> : <BookmarkBorder />}
                          </IconButton>
                        </Tooltip>
                        
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancelEdit}
                            color="inherit"
                          >
                            Cancel
                          </Button>
                          
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveEdit}
                            disabled={!editingNote.newContent.trim()}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    // View mode
                    <>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            {note.important && (
                              <Bookmark color="primary" fontSize="small" />
                            )}
                            <Chip 
                              label={NOTE_CATEGORIES.find(cat => cat.value === note.category)?.label || 'General'} 
                              size="small" 
                              color={getCategoryColor(note.category)}
                              variant="outlined"
                              icon={<Label />}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {note.updatedAt 
                                ? `Updated ${formatDate(note.updatedAt)}`
                                : `Created ${formatDate(note.createdAt)}`
                              }
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ whiteSpace: 'pre-wrap' }}
                          >
                            {note.content}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleEditNote(note)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleOpenDeleteDialog(note)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body1">No notes yet. Add your first note above!</Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteNote} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentNotes;
