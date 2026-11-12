import React, { createContext, useState, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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

  async function atualizarPerfil({ nome, email }) {
    try {
      const dados = await api.salvarPerfil(token, nome.trim(), email.trim());
      setUser({ nome: dados.usuario.nome, email: dados.usuario.email });
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function alterarSenha({ senhaAtual, novaSenha }) {
    try {
      await api.trocarSenha(token, senhaAtual, novaSenha);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function solicitarCodigo(email) {
    try {
      await api.pedirCodigo(email.trim());
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function redefinirSenha({ email, codigo, novaSenha }) {
    try {
      await api.confirmarRecuperacao(email.trim(), codigo, novaSenha);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
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
        cadastrar,
        login,
        atualizarPerfil,
        alterarSenha,
        solicitarCodigo,
        redefinirSenha,
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