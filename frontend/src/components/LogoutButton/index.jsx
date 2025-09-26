import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <button className="btn-logout" onClick={logout}>
            Sair
        </button>
    );
};

export default LogoutButton;