import "./Header.css";
import Button from '@mui/material/Button';

function Header() {

  return (
    <div className="header-container">
      <div className="title-box">NoCode InfluxDB</div>

      <div className="login-box">
        <Button className="login-btn" variant="outlined">LogIn</Button>
        <Button className="login-btn" variant="outlined">SignUp</Button>
      </div>
    </div>
  )
}

export default Header
