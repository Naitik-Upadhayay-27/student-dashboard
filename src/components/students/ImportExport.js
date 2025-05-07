import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Box,
  Alert,
  Typography,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  FileUpload, 
  FileDownload, 
  Close, 
  CheckCircle, 
  Error as ErrorIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import mockApi from '../../services/mockApi';

const ImportExport = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // 'success', 'error', 'processing'
  const [importMessage, setImportMessage] = useState('');
  const [importedData, setImportedData] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const navigate = useNavigate();
  
  // Track existing data for confirmation dialog
  const [existingData, setExistingData] = useState([]);

  // Handle opening the import dialog
  const handleOpenImportDialog = async () => {
    setImportDialogOpen(true);
    setImportStatus(null);
    setImportMessage('');
    setSelectedFile(null);
    setImportedData([]);
    setParsedData([]);
    
    // Fetch existing data for potential confirmation dialog
    try {
      const students = await mockApi.getStudents();
      setExistingData(students);
    } catch (error) {
      console.error('Error fetching existing students:', error);
    }
  };

  // Handle closing the import dialog
  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
  };

  // Handle opening the export dialog
  const handleOpenExportDialog = () => {
    setExportDialogOpen(true);
  };

  // Handle closing the export dialog
  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  // Handle file selection for import
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setImportStatus(null);
      setImportMessage('');
    } else {
      setSelectedFile(null);
      setImportStatus('error');
      setImportMessage('Please select a valid CSV file.');
    }
  };

  // Parse CSV data with better handling of line breaks and quotes
  const parseCSV = (text) => {
    // Handle different line break types
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');
    
    // Parse headers
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        console.warn(`Line ${i + 1} has ${values.length} values, expected ${headers.length}`);
        // Try to handle this gracefully by padding or truncating
        while (values.length < headers.length) values.push('');
        if (values.length > headers.length) values.length = headers.length;
      }
      
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      
      result.push(entry);
    }
    
    return { headers, data: result };
  };
  
  // Helper function to parse a CSV line handling quotes correctly
  const parseCSVLine = (line) => {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          // Double quotes inside quotes - add a single quote
          currentValue += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last field
    result.push(currentValue.trim());
    
    return result;
  };

  // Validate and normalize imported data
  const validateImportData = (data) => {
    const errors = [];
    const normalizedData = [];
    
    data.forEach((student, index) => {
      // Check required fields
      if (!student.name) {
        errors.push(`Row ${index + 1}: Missing name`);
      }
      if (!student.email) {
        errors.push(`Row ${index + 1}: Missing email`);
      }
      if (!student.course) {
        errors.push(`Row ${index + 1}: Missing course`);
      }
      
      // If no errors for this student, add to normalized data
      if (!errors.some(err => err.startsWith(`Row ${index + 1}:`))) {
        // Create a normalized student object with expected fields
        const normalizedStudent = {
          name: student.name,
          email: student.email,
          course: student.course,
          grade: student.grade || 'N/A',
          enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0],
          avatar: student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`
        };
        
        normalizedData.push(normalizedStudent);
      }
    });
    
    return { errors, normalizedData };
  };

  // Handle closing the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // Handle preparing the CSV data for import
  const handlePrepareImport = () => {
    if (!selectedFile) return;
    
    setImportStatus('processing');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const { headers, data } = parseCSV(text);
        
        // Validate and normalize the data
        const { errors, normalizedData } = validateImportData(data);
        
        if (errors.length > 0) {
          setImportStatus('error');
          setImportMessage(`Validation errors:\n${errors.join('\n')}`);
          return;
        }
        
        // Use the normalized data for import
        setParsedData(normalizedData);
        setImportedData(normalizedData);
        
        // Check if there's existing data
        if (existingData.length > 0) {
          // Show confirmation dialog
          setConfirmDialogOpen(true);
          setImportStatus(null);
        } else {
          // No existing data, proceed with import
          await processImport(data, false);
        }
      } catch (error) {
        setImportStatus('error');
        setImportMessage(`Error importing data: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      setImportStatus('error');
      setImportMessage('Error reading file.');
    };
    
    reader.readAsText(selectedFile);
  };
  
  // Process the actual import
  const processImport = async (data, keepExisting) => {
    try {
      setImportStatus('processing');
      
      if (!keepExisting) {
        // Clear existing data first
        await mockApi.clearStudents();
      }
      
      console.log('Importing students:', data); // Debug log
      
      // Process each student
      const importedStudents = [];
      for (const student of data) {
        try {
          const addedStudent = await mockApi.addStudent(student);
          importedStudents.push(addedStudent);
          console.log('Added student:', addedStudent); // Debug log
        } catch (err) {
          console.error('Error adding student:', student, err);
        }
      }
      
      setImportStatus('success');
      setImportMessage(`Successfully imported ${importedStudents.length} students.`);
      setConfirmDialogOpen(false);
      setImportDialogOpen(false); // Close the import dialog
      
      // Redirect to refresh the student list
      navigate('/dashboard', { state: { refreshData: true } });
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      setImportMessage(`Error importing data: ${error.message}`);
    }
  };
  
  // Handle importing with existing data
  const handleImportWithExisting = () => {
    processImport(parsedData, true);
  };
  
  // Handle replacing existing data
  const handleReplaceExisting = () => {
    processImport(parsedData, false);
  };

  // Handle exporting student data to CSV
  const handleExport = async () => {
    try {
      const students = await mockApi.getStudents();
      
      if (students.length === 0) {
        setImportStatus('error');
        setImportMessage('No student data to export.');
        return;
      }
      
      // Get all possible headers from all students
      const allKeys = new Set();
      students.forEach(student => {
        Object.keys(student).forEach(key => {
          if (key !== 'id' && key !== 'avatar' && key !== 'performance') {
            allKeys.add(key);
          }
        });
      });
      
      const headers = Array.from(allKeys);
      
      // Create CSV content
      let csvContent = headers.join(',') + '\\n';
      
      students.forEach(student => {
        const row = headers.map(header => {
          const value = student[header] || '';
          // Escape commas and quotes in the value
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\\n';
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      handleCloseExportDialog();
    } catch (error) {
      console.error('Error exporting data:', error);
      setImportStatus('error');
      setImportMessage(`Error exporting data: ${error.message}`);
    }
  };

  return (
    <>
      {/* Import/Export Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileUpload />}
          onClick={handleOpenImportDialog}
          sx={{ borderRadius: 2 }}
        >
          Import CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={handleOpenExportDialog}
          sx={{ borderRadius: 2 }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={handleCloseImportDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Import Students from CSV
          <IconButton onClick={handleCloseImportDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText gutterBottom>
            Upload a CSV file with student data. The file should have headers for name, email, course, and grade.
          </DialogContentText>
          
          <Box sx={{ my: 3 }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-file-upload"
              type="file"
              onChange={handleFileChange}
              disabled={importStatus === 'processing'}
            />
            <label htmlFor="csv-file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<FileUpload />}
                disabled={importStatus === 'processing'}
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Select CSV File
              </Button>
            </label>
          </Box>
          
          {selectedFile && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected File:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </Typography>
            </Paper>
          )}
          
          {importStatus === 'processing' && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing import...
              </Typography>
              <LinearProgress />
            </Box>
          )}
          
          {importStatus === 'success' && (
            <Alert 
              severity="success" 
              icon={<CheckCircle />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              {importMessage}
            </Alert>
          )}
          
          {importStatus === 'error' && (
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {importMessage}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseImportDialog} 
            color="inherit"
            disabled={importStatus === 'processing'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePrepareImport} 
            variant="contained" 
            disabled={!selectedFile || importStatus === 'processing'}
            startIcon={<FileUpload />}
          >
            Import Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Existing Data Found
          <IconButton onClick={handleCloseConfirmDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            There are already {existingData.length} students in the system. How would you like to proceed with importing {parsedData.length} new students?
          </DialogContentText>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleImportWithExisting}
              startIcon={<FileUpload />}
              fullWidth
            >
              Keep Existing & Add New
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReplaceExisting}
              startIcon={<FileUpload />}
              fullWidth
            >
              Replace All Existing
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={handleCloseExportDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Export Students to CSV
          <IconButton onClick={handleCloseExportDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            Export all student data to a CSV file. The file will include all student information except for avatars and performance data.
          </DialogContentText>
          
          {importStatus === 'error' && (
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              {importMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseExportDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            startIcon={<FileDownload />}
          >
            Export Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportExport;
