import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Auth = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "" // CRÍTICO: Campo obrigatório para o backend
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    
    if (isRegistering && !formData.phoneNumber.match(/^\+\d{11,15}$/)) {
        setError("Telefone inválido. Use o formato E.164 (ex: +5511999998888).");
        return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Erro desconhecido na autenticação."); 
      }
      
      login(data.token, data.userId); 
      setFormData({ name: "", email: "", password: "", phoneNumber: "" });
    } catch (err) {
      console.error('Erro ao autenticar:', err.message);
      setError(err.message); 
    }
  };

  return (
    <section className="container-auth">
      <article className="head-auth-left">
        <h1>Entre e Simplifique Sua Vida com Seu Assistente Pessoal</h1>
      </article>
      <article className="main-auth-right">
        <form onSubmit={handleSubmit}>
          <h2>Olá, seja bem vinda(o)!</h2>
          {error && <div className="error-message">{error}</div>} 
          
          {isRegistering && (
            <>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Telefone (+5511999998888 - E.164)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </>
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
          <button type="submit" className="btn-login">{isRegistering ? "Registrar" : "Login"}</button>
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn-register">
            {isRegistering ? "Já tem uma conta? Login" : "Não tem uma conta? Registrar"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default Auth;
