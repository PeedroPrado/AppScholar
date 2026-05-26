CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    matricula VARCHAR(20),
    curso VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(150),
    cidade VARCHAR(100),
    estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    titulacao VARCHAR(100),
    area VARCHAR(100),
    tempo_docencia VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    carga_horaria INTEGER,
    professor_id INTEGER REFERENCES professores(id),
    curso VARCHAR(100),
    semestre VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id),
    disciplina_id INTEGER REFERENCES disciplinas(id),
    nota1 NUMERIC,
    nota2 NUMERIC,
    media NUMERIC,
    situacao VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    perfil VARCHAR(50)
);

INSERT INTO usuarios (
    nome,
    email,
    senha,
    perfil
)
VALUES (
    'Administrador',
    'admin@email.com',
    '$2b$10$9iGvG0K0y4Y9x6XzQ6sY1e1mN5xY7rP4u2sP8JqF7dK2uV9xYwX1K',
    'admin'
)
ON CONFLICT (email) DO NOTHING;