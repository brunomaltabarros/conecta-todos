import React, { createContext, useState, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [contas, setContas] = useState([]);

  async function cadastrar({ nome, email, senha }) {
    try {
      const dados = await api.cadastrar(nome.trim(), email.trim(), senha);
      setToken(dados.token);
      setUser({ nome: dados.usuario.nome, email: dados.usuario.email });
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function login(email, senha) {
    try {
      const dados = await api.entrar(email.trim(), senha);
      setToken(dados.token);
      setUser({ nome: dados.usuario.nome, email: dados.usuario.email });
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  function existeConta(email) {
    const emailNormalizado = email.trim().toLowerCase();
    return contas.some((c) => c.email === emailNormalizado);
  }

  function redefinirSenha({ email, novaSenha }) {
    const emailNormalizado = email.trim().toLowerCase();
    const conta = contas.find((c) => c.email === emailNormalizado);

    if (!conta) return { ok: false, erro: 'E-mail não cadastrado' };
    if (conta.senha === novaSenha) {
      return { ok: false, erro: 'A nova senha precisa ser diferente da anterior' };
    }

    setContas((atual) =>
      atual.map((c) => (c.email === emailNormalizado ? { ...c, senha: novaSenha } : c))
    );
    return { ok: true };
  }

  function atualizarPerfil({ nome, email }) {
    const emailNormalizado = email.trim().toLowerCase();
    const emailAtual = user.email;

    const emailEmUso = contas.some(
      (c) => c.email === emailNormalizado && c.email !== emailAtual
    );
    if (emailEmUso) {
      return { ok: false, erro: 'Já existe uma conta com esse e-mail' };
    }

    setContas((atual) =>
      atual.map((c) =>
        c.email === emailAtual ? { ...c, nome: nome.trim(), email: emailNormalizado } : c
      )
    );
    setUser({ nome: nome.trim(), email: emailNormalizado });
    return { ok: true };
  }

  function alterarSenha({ senhaAtual, novaSenha }) {
    const conta = contas.find((c) => c.email === user.email);

    if (!conta) return { ok: false, erro: 'Conta não encontrada' };
    if (conta.senha !== senhaAtual) return { ok: false, erro: 'Senha atual incorreta' };

    setContas((atual) =>
      atual.map((c) => (c.email === user.email ? { ...c, senha: novaSenha } : c))
    );
    return { ok: true };
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        contas,
        cadastrar,
        login,
        existeConta,
        redefinirSenha,
        atualizarPerfil,
        alterarSenha,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}