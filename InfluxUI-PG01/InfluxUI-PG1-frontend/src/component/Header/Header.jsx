import "./Header.css";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

function Header() {
    const name = localStorage.getItem("name")
    const handleClick = () => {
        window.location.href = '/'
    }
  return (
    <div className="header-container">
      <Typography
        component="h1"
        variant="h4"
        className="header-title"
      >
        InfluxUI-PG01
      </Typography>
      <div className="login-box">
        {/*<Button className="login-btn" variant="outlined">LogIn</Button>*/}
          {name ? (
              <Typography className="welcome-string" variant="h6">Welcome, {name}</Typography>
          ) : (
              <Button className="login-btn" variant="outlined" onClick={handleClick}>LogIn</Button>
          )}
      </div>
    </div>
  );
}

export default Header;
