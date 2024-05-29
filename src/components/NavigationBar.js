import { Link } from "react-router-dom";

import KuvaLogo from "../media/KuvaLogo.png";

function NavigationBar() {
  return (
    <div className="Navigation-bar">
      <img src={KuvaLogo} alt="Kuva Logo"/>
      <Link to="/">
        <span>Home</span>
      </Link>
      <Link to="/account">
        <span>Account</span>
      </Link>
      <Link to="/settings">
        <span>Settings</span>
      </Link>
    </div>
  );
}

export default NavigationBar;
