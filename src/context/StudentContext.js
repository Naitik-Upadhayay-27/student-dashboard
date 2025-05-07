import React, { createContext, useState, useEffect, useContext } from 'react';
import mockApi from '../services/mockApi';

// Create the context
export const StudentContext = createContext();

// Create a custom hook to use the context
export const useStudents = () => useContext(StudentContext);

// Create the provider component
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a student
  const addStudent = async (student) => {
    try {
      const newStudent = await mockApi.addStudent(student);
      setStudents(prevStudents => [...prevStudents, newStudent]);
      return newStudent;
    } catch (err) {
      setError('Failed to add student');
      console.error(err);
      throw err;
    }
  };

  // Function to delete a student
  const deleteStudent = async (id) => {
    try {
      await mockApi.deleteStudent(id);
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
      throw err;
    }
  };

  // Function to update a student
  const updateStudent = async (id, data) => {
    try {
      const updatedStudent = await mockApi.updateStudent(id, data);
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id ? { ...student, ...updatedStudent } : student
        )
      );
      return updatedStudent;
    } catch (err) {
      setError('Failed to update student');
      console.error(err);
      throw err;
    }
  };

  // Function to import students from CSV
  const importStudents = async (newStudents, keepExisting = true) => {
    try {
      setLoading(true);
      
      if (!keepExisting) {
        // Clear existing students
        await mockApi.clearStudents();
        setStudents([]);
      }
      
      // Add each new student
      const addedStudents = [];
      for (const student of newStudents) {
        const newStudent = await mockApi.addStudent(student);
        addedStudents.push(newStudent);
      }
      
      // Update the students state
      setStudents(prevStudents => 
        keepExisting ? [...prevStudents, ...addedStudents] : [...addedStudents]
      );
      
      return addedStudents;
    } catch (err) {
      setError('Failed to import students');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    deleteStudent,
    updateStudent,
    importStudents
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};
