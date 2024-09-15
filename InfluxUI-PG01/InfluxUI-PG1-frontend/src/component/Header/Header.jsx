import "./Header.css";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

function Header() {
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
        <Button className="login-btn" variant="outlined">LogIn</Button>
      </div>
    </div>
  );
}

export default Header;
