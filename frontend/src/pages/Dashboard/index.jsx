import TodoForm from "../../components/TodoForm";
import TodoList from "../../components/TodoList";
import ThemeToggle from '../../components/Themes';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    const userName = user?.name || "Visitante"; 
    
    return (
        <section className="container-dashboard">
            <h1>Olá, {userName}</h1>
            <ThemeToggle />
            <h2>Dashboard aqui</h2>
            <h1 className="app-title">Adicionar Novo Lembrete</h1>
            <TodoForm /> 
            <TodoList />
        </section>
    );
}

