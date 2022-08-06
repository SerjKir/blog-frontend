import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/auth";
import { resetDefault } from "../../redux/slices/posts";
import { baseEnvUrl } from "../../consts";
import Avatar from "@mui/material/Avatar";

export const Header = () => {
  const dispatch = useDispatch();
  const { data, token } = useSelector((state) => state.auth);
  const reset = () => {
    if (window.location.pathname !== "/") {
      dispatch(resetDefault());
      window.scrollTo(0, 0);
    }
  };

  const onClickLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to={"/"}>
            <div onClick={reset}>Main</div>
          </Link>
          <div className={styles.buttons}>
            {token ? (
              <>
                <Link to="/profile">
                  <Button variant="contained">
                    <span>{data?.fullName}</span>
                    <Avatar
                      src={baseEnvUrl + data?.avatarUrl}
                      alt={data?.fullName}
                      sx={{
                        height: "25px",
                        width: "25px;",
                        marginLeft: "5px",
                      }}
                    />
                  </Button>
                </Link>
                <Link to="/add-post">
                  <Button variant="contained">Create post</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
