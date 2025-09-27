import TodoForm from "../../components/TodoForm"
import TodoList from "../../components/TodoList"


export default function Dashboard(){
    return (
        <section className="container-dashboard">
            <h2>Dashboard here</h2>
            <h1 className="app-title">Adicionar Novo Lembrete</h1>
            <TodoForm /> 
            <TodoList />
        </section>
    )
}