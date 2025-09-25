import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Hook customizado para acessar o tema e a função de alternância.
 * Garante que o hook seja usado dentro de um ThemeProvider.
 * @returns {{ theme: string, toggleTheme: () => void }}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
};
