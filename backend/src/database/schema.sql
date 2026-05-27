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

    usuario_id INTEGER REFERENCES usuarios(id),

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

    aluno_id INTEGER NOT NULL,

    disciplina_id INTEGER NOT NULL,

    nota1 NUMERIC(4,2) NOT NULL,

    nota2 NUMERIC(4,2) NOT NULL,

    media NUMERIC(4,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_aluno
      FOREIGN KEY (aluno_id)
      REFERENCES alunos(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_disciplina
      FOREIGN KEY (disciplina_id)
      REFERENCES disciplinas(id)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alunos (

    id SERIAL PRIMARY KEY,

    usuario_id INTEGER REFERENCES usuarios(id),

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