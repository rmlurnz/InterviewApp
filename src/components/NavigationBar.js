import KuvaLogo from "../media/KuvaLogo.png";

function NavigationBar() {
  return (
    <div className="Navigation-bar">
      <img src={KuvaLogo} alt="Kuva Logo"/>
      <span>Home</span>
    </div>
  );
}

export default NavigationBar;
