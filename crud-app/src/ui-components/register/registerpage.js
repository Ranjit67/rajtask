import React, { useState, useEffect } from "react";
import "./registerpage.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { color } from "@mui/system";

const Register = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });
  const [emailBoolean, setEmailBoolean] = useState(false);
  const [passwordBoolean, setPasswordBoolean] = useState(false);
  const [reEnetrPasswordBoolean, setReEnetrPasswordBoolean] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(value)) {
        setEmailBoolean(true);
      } else {
        setEmailBoolean(false);
      }
    } else if (name === "password") {
      if (value.length < 6) {
        setPasswordBoolean(false);
      } else {
        setPasswordBoolean(true);
      }
    }
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    // const { name, email, password, reEnterPassword } = user;
    // if (name > 2 && email && password && password === reEnterPassword) {
    axios.post("http://localhost:9000/register", user).then((res) => {
      alert(res.data.message);
      history.push("/login");
    });
  };
  useEffect(() => {
    if (user.password === user.reEnterPassword) {
      setReEnetrPasswordBoolean(true);
    } else {
      setReEnetrPasswordBoolean(false);
    }
    return () => {};
  }, [user.password, user.reEnterPassword]);

  return (
    <div className="register">
      <h1>Register</h1>
      <input
        type="text"
        name="name"
        value={user.name}
        placeholder="Your Name"
        onChange={handleChange}
      ></input>

      <input
        type="text"
        name="email"
        value={user.email}
        placeholder="Your Email"
        onChange={handleChange}
      ></input>
      {user.email && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "red",
            fontSize: "0.8rem",
          }}
        >
          {!emailBoolean && <p>Email is not formatted</p>}
        </div>
      )}
      <input
        type="password"
        name="password"
        value={user.password}
        placeholder="Your Password"
        onChange={handleChange}
      ></input>
      {user.password && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "red",
            fontSize: "0.8rem",
          }}
        >
          {!passwordBoolean && <p>Password must be more than 6 character.</p>}
        </div>
      )}
      <input
        type="password"
        name="reEnterPassword"
        value={user.reEnterPassword}
        placeholder="Re-enter Password"
        onChange={handleChange}
      ></input>
      {user.reEnterPassword && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "red",
            fontSize: "0.8rem",
          }}
        >
          {!reEnetrPasswordBoolean && <p>Password does not match.</p>}
        </div>
      )}
      <div
        className="button"
        onClick={() =>
          !(passwordBoolean && emailBoolean && reEnetrPasswordBoolean)
            ? () => {}
            : register()
        }
        style={
          !(passwordBoolean && emailBoolean && reEnetrPasswordBoolean)
            ? {
                backgroundColor: "gray",
                color: "rgba(255,255,255,0.7)",
              }
            : {}
        }
      >
        Register
      </div>
      <div>or</div>
      <div className="button" onClick={() => history.push("/login")}>
        Login
      </div>
    </div>
  );
};

export default Register;
