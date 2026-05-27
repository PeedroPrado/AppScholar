export interface User {
    id: string;
    nome: string;
    email: string;
    perfil: 'admin' | 'student' | 'teacher';
}

export interface Student {
    id: string;
    
    nome: string;
    matricula: string; //matrícula
    curso: string;

    email: string;
    telefone: string;

    cep: string;
    endereco: string;

    cidade: string;
    estado: string;
}

export interface Teacher {
    id: string;

    nome: string;
    titulacao:string;

    area: string;

    tempoDocencia: number;
    email: string;
}

export interface Subject {
    id: string;
    nome: string;
    cargaHoraria: number; //carga horária
    professorId: string;
    curso: string;
    semestre: number; 
}

export interface Grade {

  id: string;

  aluno: string;

  disciplina: string;

  nota1: number;

  nota2: number;

  media: number;

  status: 'Aprovado' | 'Reprovado';
}