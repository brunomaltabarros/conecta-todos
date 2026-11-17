const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const db = new DatabaseSync('dados.db');
db.exec('PRAGMA foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    servico TEXT NOT NULL,
    detalhe TEXT,
    unidade TEXT NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL,
    feedback TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
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

function vagaOcupada(unidade, data) {
  return db
    .prepare(
      "SELECT id FROM agendamentos WHERE unidade = ? AND data = ? AND status IN ('confirmado', 'concluido')"
    )
    .get(unidade, data);
}

function posicaoNaFila(registro) {
  return db
    .prepare(
      "SELECT COUNT(*) AS n FROM agendamentos WHERE status = 'espera' AND unidade = ? AND data = ? AND id <= ?"
    )
    .get(registro.unidade, registro.data, registro.id).n;
}

function promoverDaFila(unidade, data) {
  const proximo = db
    .prepare(
      "SELECT id FROM agendamentos WHERE status = 'espera' AND unidade = ? AND data = ? ORDER BY id LIMIT 1"
    )
    .get(unidade, data);
  if (proximo) {
    db.prepare("UPDATE agendamentos SET status = 'confirmado' WHERE id = ?").run(proximo.id);
  }
}

function paraCliente(registro) {
  return {
    id: String(registro.id),
    servico: registro.servico,
    detalhe: registro.detalhe,
    unidade: registro.unidade,
    data: registro.data,
    status: registro.status,
    feedback: registro.feedback ? JSON.parse(registro.feedback) : undefined,
    posicaoFila: registro.status === 'espera' ? posicaoNaFila(registro) : null,
  };
}

function buscarDoUsuario(id, usuarioId) {
  return db
    .prepare('SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?')
    .get(Number(id), usuarioId);
}

app.get('/agendamentos', autenticar, (req, res) => {
  const registros = db
    .prepare('SELECT * FROM agendamentos WHERE usuario_id = ? ORDER BY id')
    .all(req.usuarioId);
  res.json({ agendamentos: registros.map(paraCliente) });
});

app.get('/ocupacao', autenticar, (req, res) => {
  const ocupacao = db
    .prepare(
      `SELECT unidade, data,
              SUM(status IN ('confirmado', 'concluido')) AS confirmados,
              SUM(status = 'espera') AS espera
         FROM agendamentos
        GROUP BY unidade, data`
    )
    .all();
  res.json({ ocupacao });
});

app.post('/agendamentos', autenticar, (req, res) => {
  const { servico, detalhe, unidade, data, listaEspera } = req.body;
  if (!servico || !unidade || !data) {
    return res.status(400).json({ erro: 'Informe serviço, unidade e data' });
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    return res.status(400).json({ erro: 'Data inválida. Use dd/mm/aaaa' });
  }

  const ocupada = vagaOcupada(unidade, data);
  if (ocupada && !listaEspera) {
    return res.status(409).json({
      erro: `A vaga em ${unidade} para ${data} acabou de ser preenchida. Escolha outra data ou entre na lista de espera.`,
    });
  }

  const status = ocupada ? 'espera' : 'confirmado';
  const info = db
    .prepare(
      'INSERT INTO agendamentos (usuario_id, servico, detalhe, unidade, data, status) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(req.usuarioId, servico, detalhe || '', unidade, data, status);

  const criado = db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ agendamento: paraCliente(criado) });
});

app.put('/agendamentos/:id/cancelar', autenticar, (req, res) => {
  const registro = buscarDoUsuario(req.params.id, req.usuarioId);
  if (!registro) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  if (registro.status !== 'confirmado' && registro.status !== 'espera') {
    return res.status(400).json({ erro: 'Este agendamento não pode mais ser cancelado' });
  }

  db.prepare("UPDATE agendamentos SET status = 'cancelado' WHERE id = ?").run(registro.id);
  if (registro.status === 'confirmado') {
    promoverDaFila(registro.unidade, registro.data);
  }

  res.json({ agendamento: paraCliente(buscarDoUsuario(registro.id, req.usuarioId)) });
});

app.put('/agendamentos/:id/concluir', autenticar, (req, res) => {
  const registro = buscarDoUsuario(req.params.id, req.usuarioId);
  if (!registro) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  if (registro.status !== 'confirmado') {
    return res.status(400).json({ erro: 'Só um agendamento confirmado pode ser concluído' });
  }

  const { nota, comentario } = req.body.feedback || {};
  const notaValida = Number.isInteger(nota) && nota >= 0 && nota <= 5 ? nota : 0;
  const feedback = JSON.stringify({ nota: notaValida, comentario: String(comentario || '').trim() });

  db.prepare("UPDATE agendamentos SET status = 'concluido', feedback = ? WHERE id = ?")
    .run(feedback, registro.id);

  res.json({ agendamento: paraCliente(buscarDoUsuario(registro.id, req.usuarioId)) });
});

app.delete('/agendamentos', autenticar, (req, res) => {
  const confirmados = db
    .prepare("SELECT unidade, data FROM agendamentos WHERE usuario_id = ? AND status = 'confirmado'")
    .all(req.usuarioId);

  const info = db.prepare('DELETE FROM agendamentos WHERE usuario_id = ?').run(req.usuarioId);
  for (const vaga of confirmados) {
    promoverDaFila(vaga.unidade, vaga.data);
  }

  res.json({ removidos: info.changes });
});

app.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});