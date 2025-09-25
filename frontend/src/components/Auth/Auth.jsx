import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Auth = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegistering 
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register` 
      : `${import.meta.env.VITE_REACT_APP_API_URL}/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const data = await response.json();
      login(data.token, data.userId);
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error('Erro ao autenticar:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isRegistering ? "Registrar" : "Login"}</button>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Já tem uma conta? Login" : "Não tem uma conta? Registrar"}
        </button>
      </form>
    </div>
  );
};

export default Auth;