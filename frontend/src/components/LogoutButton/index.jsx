import "./index.scss";

//context
import { useAuth } from "../../context/AuthContext";

//icons
import { PiSignOutBold } from "react-icons/pi";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <li className="btn-logout" onClick={logout}>
      <PiSignOutBold className="icon-logout" />
      <p>Sign Out</p>
    </li>
  );
};

export default LogoutButton;
