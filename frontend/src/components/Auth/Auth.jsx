import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { FaChevronRight } from "react-icons/fa6";

const Auth = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(true);
  const [error, setError] = useState(null); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    
    if (isRegistering && !formData.phoneNumber.match(/^\+\d{11,15}$/)) {
        setError("Telefone inválido. Use o formato (ex: +5511999998888).");
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
      <article className="auth-head">
        <form onSubmit={handleSubmit}>
          <h3>WORK | SMART</h3>
          <h1>Sign Up</h1>
          {isRegistering && (
            <>
                <label htmlFor="name">
                  Nome:
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label htmlFor="phoneNumber">
                  Telefone:
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="(+5511999998888)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </label>
            </>
          )}
          <label htmlFor="email">
            Email:
            <input
              type="email"
              name="email"
              placeholder="usuario@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="password">
            Senha:
            <input
              type="password"
              name="password"
              placeholder="*****"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>         
          <div className="container-btn-login">
            <button type="submit" className="btn-login">
              {isRegistering ? "" : ""}<FaChevronRight />
            </button>
            {error && <div className="error-message">{error}</div>} 
          </div>
        </form>
      </article>
      <article className="auth-main">
          <div className="end-layout-main">
            <p>Welcome to the future of work.</p>
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn-register">
              {isRegistering ? "Já tem uma conta? Login" : "Não tem uma conta? Registrar"}
            </button>
          </div>
      </article>
    </section>
  );
};

export default Auth;
