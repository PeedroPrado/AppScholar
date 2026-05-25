export interface User {
    email: string;
    name: string;
    role: 'admin' | 'student' | 'teacher';
}

export interface Student {
    id: string;
    name: string;
    enrollment: string; //matrícula
    course: string;
    email: string;
    phone: string;
    zipCode: string;
    address: string;
    city: string;
    state: string;
}

export interface Teacher {
    id: string;
    name: string;
    title: string;   
    area: string;  
    yearsTeaching: number;
    email: string;
}

export interface Subject {
    id: string;
    name: string;
    workload: number; //carga horária
    teacherId: string;
    course: string;
    semester: number; 
}

export interface Grade{
    id: string;
    subjectName: string;
    grade1: number;
    grade2: number;
    average: number;
    status: 'Aprovado' | 'Reprovado' | 'Em andamento';
}