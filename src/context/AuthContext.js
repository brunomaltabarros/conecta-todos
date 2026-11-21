import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import { salvarSessao, lerSessao, apagarSessao } from '../services/sessao';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [restaurando, setRestaurando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function restaurar() {
      const sessao = await lerSessao();
      if (!sessao) {
        if (ativo) setRestaurando(false);
        return;
      }

      try {
        const dados = await api.buscarPerfil(sessao.token);
        const usuario = { nome: dados.usuario.nome, email: dados.usuario.email };
        await salvarSessao(sessao.token, usuario);
        if (ativo) {
          setToken(sessao.token);
          setUser(usuario);
        }
      } catch (erro) {
        if (erro.semConexao) {
          if (ativo) {
            setToken(sessao.token);
            setUser(sessao.usuario);
          }
        } else {
          await apagarSessao();
        }
      } finally {
        if (ativo) setRestaurando(false);
      }
    }

    restaurar();
    return () => {
      ativo = false;
    };
  }, []);

  async function iniciarSessao(dados) {
    const usuario = { nome: dados.usuario.nome, email: dados.usuario.email };
    await salvarSessao(dados.token, usuario);
    setToken(dados.token);
    setUser(usuario);
  }

  async function cadastrar({ nome, email, senha }) {
    try {
      const dados = await api.cadastrar(nome.trim(), email.trim(), senha);
      await iniciarSessao(dados);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function login(email, senha) {
    try {
      const dados = await api.entrar(email.trim(), senha);
      await iniciarSessao(dados);
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: erro.message };
    }
  }

  async function atualizarPerfil({ nome, email }) {
    try {
      const dados = await api.salvarPerfil(token, nome.trim(), email.trim());
      const usuario = { nome: dados.usuario.nome, email: dados.usuario.email };
      await salvarSessao(token, usuario);
      setUser(usuario);
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
    apagarSessao();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        restaurando,
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
