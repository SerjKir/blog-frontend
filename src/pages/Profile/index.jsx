import React, { useCallback, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { baseEnvUrl } from "../../consts";
import { LinearProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import { updateMe, uploadAvatar } from "../../api/userApi";
import { check, fetchMe } from "../../redux/slices/auth";

export const Profile = () => {
  const dispatch = useDispatch();
  const { token, data, status } = useSelector((state) => state.auth);
  const isLoading = status === "loading";
  const isAuth = !!token;

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    avatarUrl: null,
  });

  const checkIsAuth = useCallback(async () => {
    await dispatch(check());
  }, [dispatch]);

  const selectAvatar = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("image", file);
    const res = await uploadAvatar(formData);
    setUserData({ ...userData, avatarUrl: res });
  };

  const saveData = async () => {
    await updateMe(userData);
    await dispatch(fetchMe());
  };

  useEffect(() => {
    checkIsAuth().then();
  }, [checkIsAuth]);

  useEffect(() => {
    if (!isLoading && isAuth) {
      setUserData(data);
    }
  }, [data, isLoading, isAuth]);

  if (isLoading || !isAuth) {
    return <LinearProgress />;
  }

  return (
    <Paper className={styles.root}>
      <img
        src={baseEnvUrl + userData.avatarUrl}
        alt={userData.fullName}
        className={styles.image}
      />
      <div className={styles.buttons}>
        <Button variant="contained" component="label">
          Choose avatar
          <input type="file" hidden onChange={(e) => selectAvatar(e)} />
        </Button>
      </div>
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        className={styles.input}
        value={userData.fullName}
        onChange={(event) =>
          setUserData({ ...userData, fullName: event.target.value })
        }
      />
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        className={styles.input}
        value={userData.email}
        type={"email"}
        disabled
      />
      <Button
        disabled={userData.fullName === ""}
        variant={"contained"}
        type={"submit"}
        sx={{ marginTop: "10px" }}
        onClick={saveData}
      >
        Update info
      </Button>
    </Paper>
  );
};
