import { FaMoon, FaSun } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container-themes">
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
    </div>
  );
};

export default ThemeToggle;
