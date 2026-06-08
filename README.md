# 📚 App Scholar — Sistema de Gestão Acadêmica Mobile

Aplicativo mobile desenvolvido em **React Native + TypeScript** com backend em **Node.js + Express + PostgreSQL**, destinado ao gerenciamento acadêmico de instituições de ensino.

O sistema permite autenticação por perfis, gerenciamento de alunos, professores, disciplinas e notas, além da consulta de boletins acadêmicos.

Projeto desenvolvido para a disciplina **Programação para Dispositivos Móveis I** — FATEC Jacareí.
NÃO FUNCIONA NA WEB, APENAS PELO CELULAR.

---

# 🚀 Tecnologias Utilizadas

## Frontend

* React Native
* Expo
* TypeScript
* React Navigation
* Context API
* Axios
* AsyncStorage
* React Native Picker

## Backend

* Node.js
* Express
* TypeScript
* JWT
* Bcrypt
* PostgreSQL

## APIs Externas

* ViaCEP
* IBGE Localidades

---

# 👥 Perfis do Sistema

## 👑 Administrador

Pode:

* Cadastrar alunos
* Cadastrar professores
* Cadastrar disciplinas
* Cadastrar notas
* Remover registros
* Visualizar todas as informações do sistema

---

## 👨‍🏫 Professor

Pode:

* Visualizar alunos relacionados às disciplinas que ministra
* Visualizar suas disciplinas
* Cadastrar notas
* Consultar informações acadêmicas

---

## 👨‍🎓 Aluno

Pode:

* Visualizar disciplinas do seu semestre
* Consultar boletim
* Consultar notas e situação acadêmica

---

# 🔐 Funcionalidades Implementadas

## Autenticação

* Login com JWT
* Controle de acesso por perfil
* Persistência de sessão
* Middleware de autorização

---

## Alunos

* Cadastro completo
* Matrícula
* Curso
* Semestre
* Dados pessoais
* Endereço

---

## Professores

* Cadastro completo
* Área de atuação
* Titulação
* Tempo de docência

---

## Disciplinas

* Cadastro de disciplinas
* Associação com professor
* Associação com semestre
* Associação com curso

---

## Notas

* Cadastro de notas
* Cálculo automático de média
* Situação (Aprovado/Reprovado)
* Validação de semestre

---

## Boletim

* Visualização individual
* Média por disciplina
* Situação acadêmica

---

## Integrações Externas

### ViaCEP

* Busca automática do endereço pelo CEP

### IBGE

* Carregamento de estados
* Carregamento de municípios

---

# 🗄️ Banco de Dados

O sistema utiliza PostgreSQL com as seguintes entidades:

* Usuários
* Alunos
* Professores
* Disciplinas
* Notas
* Histórico Escolar

---

# 📂 Estrutura do Projeto

```text
AppScholar/

├── backend/
│   ├── src/
│   │   ├── controllers
│   │   ├── services
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── database
│   │   └── server.ts
│
├── mobile/
│   ├── src/
│   │   ├── screens
│   │   ├── components
│   │   ├── services
│   │   ├── context
│   │   ├── hooks
│   │   ├── navigation
│   │   ├── styles
│   │   └── types
```

---

# ⚙️ Configuração do Backend

Crie um arquivo `.env` na pasta backend:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=app_scholar

JWT_SECRET=appscholar_secret
```

---

# ▶️ Como Executar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/PeedroPrado/AppScholar.git
```

---

## 2. Backend

Entrar na pasta:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

Servidor:

```text
http://localhost:3000
```

---

## 3. Mobile

Entrar na pasta:

```bash
cd mobile
```

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npx expo start
```

---

# 📡 Configuração do IP da API

Durante o desenvolvimento, o aplicativo consome o backend utilizando o IP local da máquina.

Arquivo:

```text
mobile/src/services/api.ts
```

Exemplo:

```ts
export const api = axios.create({
  baseURL: "http://192.168.0.100:3000/api"
});
```

⚠️ Importante:

Sempre que o computador mudar de rede ou receber um novo IP, será necessário atualizar o endereço no arquivo `api.ts`.

Para descobrir o IP:

### Windows

```bash
ipconfig
```

Utilize o valor exibido em:

```text
IPv4 Address
```

Exemplo:

```text
192.168.0.100
```

E atualize:

```ts
baseURL: "http://192.168.0.100:3000/api"
```

O celular e o computador devem estar conectados à mesma rede Wi-Fi.

---

# 🧪 Usuário Administrador

Criado automaticamente pelo banco:

```text
Email:
admin@email.com

Senha:
123456
```

Professores e alunos são criados pelo administrador.

---

# 📱 Execução no Celular

1. Instale o Expo Go
2. Execute:

```bash
npx expo start
```

3. Escaneie o QR Code
4. Faça login

---

# 🔒 Regras de Negócio

* Alunos visualizam apenas disciplinas do próprio semestre
* Professores visualizam apenas disciplinas sob sua responsabilidade
* Notas só podem ser lançadas para disciplinas do mesmo semestre do aluno
* Apenas administradores podem cadastrar alunos, professores e disciplinas

---

# 👨‍💻 Autor

Pedro Henrique Prado de Novaes

FATEC Jacareí — Desenvolvimento de Software Multiplataforma

GitHub:
https://github.com/PeedroPrado

---

# 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
