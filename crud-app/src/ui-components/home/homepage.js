import React, { useState, useEffect, useRef } from "react";
import "./homepage.css";
import { Dialog, Button, Grid, TextField } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// start

const Homepage = ({ user, setLoginUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailBoolean, setEmailBoolean] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordBoolean, setPasswordBoolean] = useState(true);
  const [dialogBoolean, setDialogBoolean] = useState(false);
  const [deleteDialogBoolean, setdeleteDialogBoolean] = useState(false);
  const [snakBarData, setSnakBarData] = useState({
    isOpen: false,
    message: "",
  });
  const [recentUserData, setRecentUserData] = useState({});
  const [realTime, setRealTime] = useState(false);
  const [backDropBoolean, setBackDropBoolean] = useState(false);
  const handleClose = () => {
    setDialogBoolean((prev) => !prev);
  };

  const nameHandler = (e) => {
    setName(e.target.value);
  };
  const snakBarClose = () => {
    setSnakBarData({
      isOpen: false,
      message: "",
    });
  };
  const closeDeleteDiolog = () => {
    setdeleteDialogBoolean(false);
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
  const emailHandler = (e) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(e.target.value)) {
      setEmailBoolean(false);
    } else {
      setEmailBoolean(true);
    }
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    if (e.target.value.length < 6) {
      setPasswordBoolean(true);
    } else {
      setPasswordBoolean(false);
    }

    setPassword(e.target.value);
  };
  useEffect(() => {
    if (!email) {
      setEmailBoolean(false);
    }
    if (!password) {
      setPasswordBoolean(false);
    }
  }, [email, password]);
  const submitHandler = async () => {
    try {
      handleClose();

      setBackDropBoolean(true);
      const fetchData = await fetch("http://localhost:9000/updateData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?._id,
          name,
          email,
          password,
        }),
      });
      const result = await fetchData.json();
      if (fetchData.status === 200) {
        setSnakBarData({
          isOpen: true,
          message: result?.data,
        });
        setRealTime((prev) => !prev);
      } else {
        setSnakBarData({
          isOpen: true,
          message: result?.error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setBackDropBoolean(false);
    }
  };
  const deleteUserHandler = async () => {
    try {
      setBackDropBoolean(true);
      const fetchData = await fetch("http://localhost:9000/deleteUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?._id,
        }),
      });
      const result = await fetchData?.json();
      if (fetchData?.status === 200) {
        setSnakBarData({
          isOpen: true,
          message: result?.data,
        });
      } else {
        setSnakBarData({
          isOpen: true,
          message: result.error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBackDropBoolean(false);

      closeDeleteDiolog();
      setLoginUser({});
      //   await history.push("/");
    }
  };
  const isMounted = useRef(false);
  useEffect(() => {
    if (user?._id) {
      isMounted.current = true;
      fetchRequest();
    }
    return () => {
      isMounted.current = false;
    };
  }, [user?._id, realTime]);
  const fetchRequest = async () => {
    if (isMounted.current) {
      const fetchData = await fetch(`http://localhost:9000/${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await fetchData.json();
      if (fetchData.status === 200) {
        setRecentUserData(result?.data);
        // history.push("/");
      } else {
      }
    } else {
      setRecentUserData({});
    }
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropBoolean}
        //   onClick={backdropClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snakBarData.isOpen}
        autoHideDuration={6000}
        onClose={snakBarClose}
        message={snakBarData.message}
        action={action}
      />
      <div className="homepage">
        <h1>Hello Homepage</h1>
        <div
          style={{
            width: "40%",
            margin: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Name</h3>
            <h4>{recentUserData.name}</h4>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Email</h3>
            <h4>{recentUserData.email}</h4>
          </div>
        </div>

        <div
          className="button"
          onClick={() => {
            setDialogBoolean(true);
          }}
        >
          Update
        </div>
        <div
          className="button"
          onClick={() => {
            setdeleteDialogBoolean(true);
          }}
        >
          Delete
        </div>
        <div className="button" onClick={() => setLoginUser({})}>
          Logout
        </div>
      </div>
      {/* update div */}
      <Dialog
        open={dialogBoolean}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Profile Update"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Name"
                margin="normal"
                fullWidth
                value={name}
                onChange={nameHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Email"
                margin="normal"
                fullWidth
                value={email}
                onChange={emailHandler}
              />
              {emailBoolean && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    fontSize: "0.8rem",
                    color: "red",
                  }}
                >
                  {email && "Email is not formatted."}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Password"
                margin="normal"
                fullWidth
                value={password}
                onChange={passwordHandler}
              />
              {passwordBoolean && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    fontSize: "0.8rem",
                    color: "red",
                  }}
                >
                  {password &&
                    "Password character must be grater than or equal to 6 ."}
                </div>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                disabled={!(!emailBoolean && !passwordBoolean)}
                // disabled={false}
                color="primary"
                onClick={submitHandler}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
      </Dialog>

      <Dialog
        open={deleteDialogBoolean}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteDiolog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Important"}</DialogTitle>
        <DialogContent>You will lose your Account.</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDiolog}>cancel</Button>
          <Button onClick={deleteUserHandler}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Homepage;
