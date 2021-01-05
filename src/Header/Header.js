// header
import logo from "../Images/logo.png";
import "../Header/Header.css";
import HomeSharpIcon from "@material-ui/icons/HomeSharp";
import Signup from "./Auth/Signup";
// Signup
import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import FacebookIcon from "@material-ui/icons/Facebook";
import "./Auth/Signup.css";
import { auth } from "../firebase";
import firebase from "firebase";
// SignUp
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    signup: {
      position: "absolute",
      width: 350,
      height: 620,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    signin: {
      position: "absolute",
      width: 350,
      height: 550,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
const Header = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [user, setUser] = useState(null);
  const [openSingin, setOpenSingin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          // if new user created
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out...
        setUser(null);
      }
    });
    return () => {
      //perform some clean up actions
      unsubscribe();
    };
  }, [user, username]);
  // SIGNUP HANDLER
  const signupHandler = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  // SIGNIN HANDLER
  const signinHandler = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSingin(false);
  };

  // FACEBOOK AUTHENTICATION
  const facebookLogin = (event) => {
    event.preventDefault();

    auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((result) => {
        if (result.credential) {
          var credential = result.credential;
          var token = credential.accessToken;
        }
        var user = result.user;
      })
      .catch((error) => alert(error.message));
  };

  const signUpForm = (
    <div style={modalStyle} className={classes.signup}>
      <form className="signup-form">
        <div>
          <img className="logo" src={logo} alt="logo" />
        </div>
        <h3 className="text-center">
          Sign up to see photos and videos from your friends.
        </h3>
        <Button className="button" onClick={facebookLogin}>
          <FacebookIcon className="fb-icon" /> Continue With Facebook
        </Button>
        <span className="span">OR</span>

        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="button signup-btn" onClick={signupHandler}>
          Sign Up
        </Button>
      </form>
      <p>
        By signing up, you agree to our <strong>Terms</strong> ,
        <strong>Data Policy</strong> and <strong>Cookies Policy</strong> .
      </p>
      <div className="form__footer">
        <h4>
          Have an account? <strong>Log in</strong>
        </h4>
      </div>
    </div>
  );
  const signInForm = (
    <div style={modalStyle} className={classes.signin}>
      <form className="signin-form">
        <div>
          <img className="logo" src={logo} alt="logo" />
        </div>

        <Input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="input"
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="button signin-btn " onClick={signinHandler}>
          Sign In
        </Button>
        <span className="span">OR</span>
        <div className="fb-login flex item-center">
          <FacebookIcon className="fb-icon" />
          <p> Login With Facebook</p>
        </div>
        <p>Forget password?</p>
      </form>
      <div className="form__footer">
        <h4>
          Don't have an account? <strong>Sign up</strong>
        </h4>
      </div>
    </div>
  );
  return (
    <div className="header flex justify-between item-center">
      <img className="header__logo" src={logo} alt="Brand" />
      <div>
        <input />
      </div>
      <div className="header__links flex item-center">
        <div>
          <HomeSharpIcon />
        </div>
        <div>
          {user ? (
            <div>
              <Button onClick={() => auth.signOut()}>Log Out</Button>
            </div>
          ) : (
            <div className="loginContainer flex item-center">
              <Button onClick={() => setOpenSingin(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
          <Modal open={open} onClose={() => setOpen(false)}>
            {signUpForm}
          </Modal>
          <Modal open={openSingin} onClose={() => setOpenSingin(false)}>
            {signInForm}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Header;
