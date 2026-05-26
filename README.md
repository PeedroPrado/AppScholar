# 📚 App Scholar — Gerenciamento Acadêmico Mobile

Aplicativo mobile desenvolvido em **React Native + TypeScript** para gerenciamento acadêmico de uma instituição de ensino superior tecnológica.
O sistema permite autenticação por perfil, cadastro de informações acadêmicas e visualização de boletins.

Este projeto foi desenvolvido como atividade da disciplina **Programação para Dispositivos Móveis I**.

---

# 🚀 Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* React Navigation
* Context API
* AsyncStorage (persistência local)
* Styled Components / Theme
* Hooks (useState, useEffect, useContext)

---

# 👥 Perfis do Sistema

O aplicativo possui três perfis de acesso:

## 👑 Administrador

Pode:

* Cadastrar alunos
* Cadastrar professores
* Cadastrar disciplinas
* Visualizar listas completas
* Remover registros
* Visualizar boletins

---

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=app_scholar

JWT_SECRET=appscholar_secret

## 👨‍🏫 Professor

Pode:

* Visualizar lista de alunos cadastrados pelo admin
* Visualizar disciplinas cadastradas pelo admin
* Não pode cadastrar nem remover dados

---

## 👨‍🎓 Aluno

Pode:

* Visualizar suas disciplinas
* Visualizar boletim (mock)
* Não pode cadastrar dados

---

# 🔐 Logins para Teste

### Administrador

```
email: admin@fatec.sp.gov.br
senha: 1234
```

### Professor

```
email: professor@fatec.sp.gov.br
senha: 1234
```

### Aluno

```
email: aluno@fatec.sp.gov.br
senha: 1234
```

---

# 📱 Funcionalidades Implementadas

## Autenticação

* Login mock
* Controle por perfil
* Persistência de sessão

## Dashboard

* Menu dinâmico por perfil
* Informações do usuário logado
* Logout

## Cadastro de Alunos

* Nome
* Matrícula
* Curso
* Email
* Telefone
* CEP (auto preenchimento)
* Endereço
* Cidade
* Estado

## Cadastro de Professores

* Nome
* Titulação
* Área de atuação
* Tempo de docência
* Email

## Cadastro de Disciplinas

* Nome
* Carga horária
* Professor responsável
* Curso
* Semestre

## Listagens

* Lista de alunos
* Lista de professores
* Lista de disciplinas
* Busca em tempo real
* Remoção (apenas admin)

## Boletim

* Disciplina
* Nota 1
* Nota 2
* Média
* Situação
* Dados mockados

## Persistência

* Dados salvos com AsyncStorage
* Mantém dados entre logins
* Compartilhamento entre perfis

---

# 📂 Estrutura do Projeto

```
src
 ├── components
 ├── context
 │   ├── AuthContext
 │   └── DataContext
 ├── screens
 │   ├── LoginScreen
 │   ├── DashboardScreen
 │   ├── StudentFormScreen
 │   ├── StudentListScreen
 │   ├── TeacherFormScreen
 │   ├── TeacherListScreen
 │   ├── SubjectFormScreen
 │   ├── SubjectListScreen
 │   └── GradesScreen
 ├── navigation
 ├── styles
 └── types
```

---

# ▶️ Como Rodar o Projeto

## 1. Clonar repositório

```
git clone https://github.com/seu-repositorio/AppScholar.git
```

## 2. Entrar na pasta

```
cd AppScholar
```

## 3. Instalar dependências

```
npm install
```

## 4. Instalar AsyncStorage

```
npx expo install @react-native-async-storage/async-storage
```

## 5. Rodar projeto

```
npx expo start
```

---

# 📱 Executar no celular

* Instale **Expo Go**
* Escaneie o QR Code
* O app abrirá automaticamente

---

# 🧪 Como Testar

## Teste Admin

1. Login como admin
2. Cadastrar aluno
3. Cadastrar professor
4. Cadastrar disciplina
5. Sair
6. Entrar como professor
7. Verificar dados

---

## Teste Professor

1. Login professor
2. Ver lista alunos
3. Ver disciplinas
4. Confirmar que não pode cadastrar

---

## Teste Aluno

1. Login aluno
2. Ver disciplinas
3. Ver boletim
4. Confirmar que não pode cadastrar

---

# 💾 Persistência de Dados

Os dados são armazenados localmente utilizando:

* AsyncStorage
* Context API

Os dados permanecem salvos mesmo após:

* logout
* fechar app
* trocar perfil

---

# 🔜 Parte 2 (Back-end)

Na próxima etapa o app será conectado a:

* Node.js
* Express
* PostgreSQL
* API REST

O AsyncStorage será substituído por requisições HTTP.

---

# 👨‍💻 Autor

Pedro Henrique Prado de Novaes
FATEC Jacareí — Desenvolvimento de Software Multiplataforma

---

# 📄 Licença

Projeto acadêmico para fins educacionais.
