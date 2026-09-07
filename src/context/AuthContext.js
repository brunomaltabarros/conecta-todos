import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [contas, setContas] = useState([]);

  function cadastrar({ nome, email, senha }) {
    const emailNormalizado = email.trim().toLowerCase();

    if (contas.some((c) => c.email === emailNormalizado)) {
      return { ok: false, erro: 'Já existe uma conta com esse e-mail' };
    }

    const novaConta = { nome: nome.trim(), email: emailNormalizado, senha };
    setContas((atual) => [...atual, novaConta]);
    setUser({ nome: novaConta.nome, email: novaConta.email });
    return { ok: true };
  }

  function login(email, senha) {
    const emailNormalizado = email.trim().toLowerCase();
    const conta = contas.find((c) => c.email === emailNormalizado);

    if (!conta) return { ok: false, erro: 'E-mail não cadastrado' };
    if (conta.senha !== senha) return { ok: false, erro: 'Senha incorreta' };

    setUser({ nome: conta.nome, email: conta.email });
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
  }

  return (
    <AuthContext.Provider
      value={{ user, contas, cadastrar, login, atualizarPerfil, alterarSenha, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}