const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('dados.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL
  )
`);

const SEGREDO = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';

function criarToken(id) {
  return jwt.sign({ id }, SEGREDO, { expiresIn: '7d' });
}

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.replace('Bearer ', '');
  try {
    req.usuarioId = jwt.verify(token, SEGREDO).id;
    next();
  } catch {
    res.status(401).json({ erro: 'Sessão inválida. Entre novamente.' });
  }
}

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
  }

  const emailLimpo = email.trim().toLowerCase();
  const jaExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailLimpo);
  if (jaExiste) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);
  const info = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome.trim(), emailLimpo, senhaHash);

  const usuario = { id: info.lastInsertRowid, nome: nome.trim(), email: emailLimpo };
  res.status(201).json({ usuario, token: criarToken(usuario.id) });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  const emailLimpo = email.trim().toLowerCase();
  const registro = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(emailLimpo);

  if (!registro || !bcrypt.compareSync(senha, registro.senha_hash)) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  }

  const usuario = { id: registro.id, nome: registro.nome, email: registro.email };
  res.json({ usuario, token: criarToken(usuario.id) });
});

app.get('/perfil', autenticar, (req, res) => {
  const registro = db
    .prepare('SELECT id, nome, email FROM usuarios WHERE id = ?')
    .get(req.usuarioId);
  if (!registro) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json({ usuario: registro });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});