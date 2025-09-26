import ReactDOM from 'react-dom/client';
import App from './App';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider } from './context/ThemeContext';

// Estilos
import './scss/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Estrutura de Provedores: Auth > Todo (depende de Auth) > Theme
root.render(
  <AuthProvider>
    <TodoProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TodoProvider>
  </AuthProvider>
);
