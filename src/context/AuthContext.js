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

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, contas, cadastrar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}