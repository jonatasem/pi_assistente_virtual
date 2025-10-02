import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { TodoProvider } from "./context/TodoContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./scss/main.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <TodoProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TodoProvider>
  </AuthProvider>
);