import React, { useState } from "react";
import "./loginpage.css";
import Snackbar from "@mui/material/Snackbar";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useHistory } from "react-router-dom";

const Login = ({ setLoginUser }) => {
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [snakBarData, setSnakBarData] = useState({
    isOpen: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = async () => {
    const fetchData = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        password: user?.password,
      }),
    });
    const result = await fetchData.json();
    if (fetchData.status === 200) {
      setLoginUser(result?.user);
      history.push("/");
    } else {
      setSnakBarData({
        isOpen: true,
        message: "Incorrect email and password.",
      });
    }
  };
  const snakBarClose = () => {
    setSnakBarData({
      isOpen: false,
      message: "",
    });
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={snakBarClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={snakBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <div className="login">
      <Snackbar
        open={snakBarData.isOpen}
        autoHideDuration={6000}
        onClose={snakBarClose}
        message={snakBarData.message}
        action={action}
      />
      <h1>Login</h1>
      <input
        type="text"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter your Email"
      ></input>
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter your Password"
      ></input>
      <div className="button" onClick={login}>
        Login
      </div>
      <div>or</div>
      <div className="button" onClick={() => history.push("/register")}>
        Register
      </div>
    </div>
  );
};

export default Login;
