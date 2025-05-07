import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of axios
const api = axios.create();

// Create a new instance of MockAdapter
const mock = new MockAdapter(api, { delayResponse: 1000 });

// Sample student data
const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    course: 'Computer Science',
    grade: 'A',
    enrollmentDate: '2023-09-01',
    avatar: 'https://mui.com/static/images/avatar/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    course: 'Mathematics',
    grade: 'B+',
    enrollmentDate: '2023-08-15',
    avatar: 'https://mui.com/static/images/avatar/2.jpg'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    course: 'Physics',
    grade: 'A-',
    enrollmentDate: '2023-09-05',
    avatar: 'https://mui.com/static/images/avatar/3.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    course: 'Computer Science',
    grade: 'B',
    enrollmentDate: '2023-09-10',
    avatar: 'https://mui.com/static/images/avatar/4.jpg'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    course: 'Mathematics',
    grade: 'A+',
    enrollmentDate: '2023-08-20',
    avatar: 'https://mui.com/static/images/avatar/5.jpg'
  },
  {
    id: 6,
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    course: 'Physics',
    grade: 'B-',
    enrollmentDate: '2023-09-03',
    avatar: 'https://mui.com/static/images/avatar/6.jpg'
  },
  {
    id: 7,
    name: 'David Miller',
    email: 'david.miller@example.com',
    course: 'Computer Science',
    grade: 'A',
    enrollmentDate: '2023-08-25',
    avatar: 'https://mui.com/static/images/avatar/7.jpg'
  },
  {
    id: 8,
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    course: 'Mathematics',
    grade: 'B+',
    enrollmentDate: '2023-09-07',
    avatar: 'https://mui.com/static/images/avatar/8.jpg'
  }
];

// Mock GET request to fetch all students
mock.onGet('/api/students').reply(200, {
  students,
  message: 'Students fetched successfully'
});

// Mock GET request to fetch a single student
mock.onGet(/\/api\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const student = students.find(s => s.id === id);
  
  if (student) {
    return [200, { student, message: 'Student fetched successfully' }];
  }
  
  return [404, { message: 'Student not found' }];
});

// Mock POST request to add a new student
mock.onPost('/api/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  
  // Generate a new ID
  const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  
  // Add the new student to the array
  const student = {
    id,
    ...newStudent,
    enrollmentDate: new Date().toISOString().split('T')[0]
  };
  
  students.push(student);
  
  return [201, { student, message: 'Student added successfully' }];
});

// Mock DELETE request to remove a student
mock.onDelete(/\/api\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) {
    return [404, { message: 'Student not found' }];
  }
  
  // Remove the student from the array
  const removedStudent = students.splice(index, 1)[0];
  
  return [200, { student: removedStudent, message: 'Student removed successfully' }];
});

// Add a method to update student performance data
const mockApi = api;
mockApi.updateStudentPerformance = (studentId, performanceData) => {
  return new Promise((resolve, reject) => {
    try {
      // Find the student
      const student = students.find(s => s.id === studentId);
      
      if (!student) {
        reject(new Error(`Student with ID ${studentId} not found`));
        return;
      }
      
      // Update the performance data
      student.performance = performanceData;
      
      resolve(student);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a method to get all students directly
mockApi.getStudents = () => {
  return new Promise((resolve) => {
    resolve([...students]);
  });
};

// Add a method to add a note to a student
mockApi.addStudentNote = (studentId, note) => {
  return new Promise((resolve, reject) => {
    try {
      // Find the student
      const student = students.find(s => s.id === studentId);
      
      if (!student) {
        reject(new Error(`Student with ID ${studentId} not found`));
        return;
      }
      
      // Initialize notes array if it doesn't exist
      if (!student.notes) {
        student.notes = [];
      }
      
      // Add the note with a unique ID
      const newNote = {
        id: Date.now().toString(),
        ...note,
        createdAt: new Date().toISOString()
      };
      
      student.notes.push(newNote);
      
      resolve(newNote);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a method to delete a student note
mockApi.deleteStudentNote = (studentId, noteId) => {
  return new Promise((resolve, reject) => {
    try {
      // Find the student
      const student = students.find(s => s.id === studentId);
      
      if (!student) {
        reject(new Error(`Student with ID ${studentId} not found`));
        return;
      }
      
      // Check if notes array exists
      if (!student.notes) {
        reject(new Error(`Student has no notes`));
        return;
      }
      
      // Find the note index
      const noteIndex = student.notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        reject(new Error(`Note with ID ${noteId} not found`));
        return;
      }
      
      // Remove the note
      student.notes.splice(noteIndex, 1);
      
      resolve({ success: true });
    } catch (error) {
      reject(error);
    }
  });
};

// Add a method to clear all students (for CSV import)
mockApi.clearStudents = () => {
  return new Promise((resolve) => {
    // Clear the students array
    students.length = 0;
    resolve({ success: true });
  });
};

// Add a method to add a student directly
mockApi.addStudent = (studentData) => {
  return new Promise((resolve) => {
    // Generate a new ID
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    // Create the new student object
    const student = {
      id,
      ...studentData,
      // Ensure enrollmentDate is set if not provided
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0]
    };
    
    // Add to the students array
    students.push(student);
    
    // Resolve with the new student
    resolve(student);
  });
};

// Export the API instance
export default mockApi;
