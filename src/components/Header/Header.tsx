import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { signOut } from "../../firebase/auth";
import "./Header.css";
import { Link } from "react-router";

export default function Header() {
  const { currentUser, userLoggedIn } = useAuth();

  return (
    <>
    {userLoggedIn&&
    <div className="header-container">
      <div className="header">
        <h3>Hello👋, <Link to="/">{currentUser.displayName}</Link></h3>
        <button className="header-logout-btn" onClick={signOut}>
          LogOut
        </button>
      </div>
    </div>}
    </>
  );
}
