const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const db = new DatabaseSync('dados.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL
  )
`);

const SEGREDO = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';
const PORTA = Number(process.env.PORT) || 3000;

const codigosDeRecuperacao = new Map();
const VALIDADE_DO_CODIGO = 15 * 60 * 1000;

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

function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

function normalizar(email) {
  return String(email || '').trim().toLowerCase();
}

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
  }

  const emailLimpo = normalizar(email);
  if (buscarPorEmail(emailLimpo)) {
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

  const registro = buscarPorEmail(normalizar(email));
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

app.put('/perfil', autenticar, (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Informe nome e e-mail' });
  }

  const emailLimpo = normalizar(email);
  const emUso = buscarPorEmail(emailLimpo);
  if (emUso && emUso.id !== req.usuarioId) {
    return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail' });
  }

  db.prepare('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?')
    .run(nome.trim(), emailLimpo, req.usuarioId);

  res.json({ usuario: { id: req.usuarioId, nome: nome.trim(), email: emailLimpo } });
});

app.put('/senha', autenticar, (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ erro: 'Informe a senha atual e a nova senha' });
  }
  if (novaSenha.length < 6) {
    return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres' });
  }

  const registro = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.usuarioId);
  if (!registro) return res.status(404).json({ erro: 'Usuário não encontrado' });
  if (!bcrypt.compareSync(senhaAtual, registro.senha_hash)) {
    return res.status(401).json({ erro: 'Senha atual incorreta' });
  }
  if (bcrypt.compareSync(novaSenha, registro.senha_hash)) {
    return res.status(400).json({ erro: 'A nova senha precisa ser diferente da anterior' });
  }

  db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?')
    .run(bcrypt.hashSync(novaSenha, 10), req.usuarioId);

  res.json({ ok: true });
});

app.post('/recuperar-senha/solicitar', (req, res) => {
  const emailLimpo = normalizar(req.body.email);
  if (!emailLimpo) return res.status(400).json({ erro: 'Informe o e-mail' });

  if (!buscarPorEmail(emailLimpo)) {
    return res.status(404).json({ erro: 'E-mail não cadastrado' });
  }

  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  codigosDeRecuperacao.set(emailLimpo, { codigo, expiraEm: Date.now() + VALIDADE_DO_CODIGO });

  console.log('');
  console.log('========================================');
  console.log(`  CODIGO DE RECUPERACAO: ${codigo}`);
  console.log(`  conta: ${emailLimpo}`);
  console.log('  valido por 15 minutos');
  console.log('========================================');
  console.log('');

  res.json({ ok: true });
});

app.post('/recuperar-senha/confirmar', (req, res) => {
  const { codigo, novaSenha } = req.body;
  const emailLimpo = normalizar(req.body.email);

  const pendente = codigosDeRecuperacao.get(emailLimpo);
  if (!pendente || pendente.expiraEm < Date.now()) {
    codigosDeRecuperacao.delete(emailLimpo);
    return res.status(400).json({ erro: 'Código expirado. Peça um novo.' });
  }
  if (pendente.codigo !== String(codigo || '').trim()) {
    return res.status(400).json({ erro: 'Código incorreto' });
  }
  if (!novaSenha || novaSenha.length < 6) {
    return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres' });
  }

  const registro = buscarPorEmail(emailLimpo);
  if (!registro) return res.status(404).json({ erro: 'E-mail não cadastrado' });
  if (bcrypt.compareSync(novaSenha, registro.senha_hash)) {
    return res.status(400).json({ erro: 'A nova senha precisa ser diferente da anterior' });
  }

  db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?')
    .run(bcrypt.hashSync(novaSenha, 10), registro.id);
  codigosDeRecuperacao.delete(emailLimpo);

  res.json({ ok: true });
});

app.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});