import React, { createContext, useState, useContext, useEffect } from 'react';
import { Student, Teacher, Subject } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataContextData {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  addStudent: (student: Student) => void;
  addTeacher: (teacher: Teacher) => void;
  addSubject: (subject: Subject) => void;
  removeStudent: (id: string) => void;
  removeTeacher: (id: string) => void;
  removeSubject: (id: string) => void;
}

export const DataContext = createContext<DataContextData>({} as DataContextData);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // carregar dados salvos
  useEffect(() => {
    async function loadData() {
      const storedStudents = await AsyncStorage.getItem('students');
      const storedTeachers = await AsyncStorage.getItem('teachers');
      const storedSubjects = await AsyncStorage.getItem('subjects');

      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
      if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
    }

    loadData();
  }, []);

  // salvar students
  useEffect(() => {
    AsyncStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // salvar teachers
  useEffect(() => {
    AsyncStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  // salvar subjects
  useEffect(() => {
    AsyncStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  function addStudent(student: Student) {
    setStudents(prev => [student, ...prev]);
  }

  function addTeacher(teacher: Teacher) {
    setTeachers(prev => [teacher, ...prev]);
  }

  function addSubject(subject: Subject) {
    setSubjects(prev => [subject, ...prev]);
  }

  function removeStudent(id: string) {
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  function removeTeacher(id: string) {
    setTeachers(prev => prev.filter(t => t.id !== id));
  }

  function removeSubject(id: string) {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        subjects,
        addStudent,
        addTeacher,
        addSubject,
        removeStudent,
        removeTeacher,
        removeSubject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Hook customizado
export function useData() {
  return useContext(DataContext);
}