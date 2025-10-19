import "./index.scss";

//components
import LogoutButton from "../LogoutButton";

//images
import imgLogoHeader from "../../assets/images/logo.png";

//icons
import { FaRegUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";

export default function HeaderComponent() {
  return (
    <header className="container-header">
      <div className="header-logo">
        <img src={imgLogoHeader} alt="imagem logo" />
        <h1>Business</h1>
      </div>
      <article className="header-head">
        <ul>
          <li>
            <IoAnalyticsSharp className="icon-header-nav" />
            Analytics
          </li>
          <li className="active-header">
            <MdOutlineDashboard className="icon-header-nav" />
            Dashboard
          </li>
        </ul>
      </article>
      <article className="header-main">
        <ul>
          <li>
            <FaRegUser className="icon-header-nav" />
            Profile
          </li>
          <li>
            <CiSettings className="icon-header-nav" />
            Settings
          </li>
        </ul>
      </article>
      <article className="header-footer">
        <LogoutButton />
      </article>
    </header>
  );
}
