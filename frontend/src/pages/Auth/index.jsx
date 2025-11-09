import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import Loading from "../../components/Loading";
import "./index.scss";

const Auth = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPhoneValid = (phone) => /^\+\d{11,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isRegistering && !isPhoneValid(formData.phoneNumber)) {
      setError("Telefone inválido. Use o formato internacional (ex: +5511999998888).");
      setIsLoading(false);
      return;
    }

    const dataToSend = isRegistering
      ? formData
      : { email: formData.email, password: formData.password };

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/auth/${isRegistering ? "register" : "login"}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Erro desconhecido na autenticação.");

      login(data.token, data.userId);
      setFormData({ name: "", email: "", password: "", phoneNumber: "" });
    } catch (err) {
      console.error("Erro ao autenticar:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
    setError(null);
    setFormData({ name: "", email: "", password: "", phoneNumber: "" });
  };

  return (
    <section className="container-auth">
      <article className="auth-head">
        <form onSubmit={handleSubmit}>
          <h3>P.I - Assistente | Virtual</h3>
          <h1>{isRegistering ? "Registrar" : "Login"}</h1>
          {isRegistering && (
            <>
              <label htmlFor="name">
                Nome:
                <input
                  type="text"
                  name="name"
                  placeholder="Francisco Nascimento"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </label>
              <label htmlFor="phoneNumber">
                Telefone:
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+5511999998888"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </label>
            </>
          )}
          <label htmlFor="email">
            Email:
            <input
              type="email"
              name="email"
              placeholder="francisco@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>
          <label htmlFor="password">
            Senha:
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*****"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <div className="container-btn-login">
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? <Loading /> : <FaChevronRight />}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </form>
      </article>
      <article className="auth-main">
        <div className="end-layout-main">
          <p>Bem-vindo ao futuro.</p>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="btn-register"
          >
            {isRegistering ? "Já tem uma conta? Login" : "Não tem uma conta? Registrar"}
          </button>
        </div>
      </article>
    </section>
  );
};

export default Auth;
