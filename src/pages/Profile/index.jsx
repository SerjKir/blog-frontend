import React, { useCallback, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { baseEnvUrl } from "../../consts";
import { fetchAuthMe } from "../../redux/slices/auth";
import { LinearProgress } from "@mui/material";
import axios from "../../axios";
import Paper from "@mui/material/Paper";

export const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth);
  const isLoading = userData.status === "loading";

  const [data, setData] = useState({
    fullName: "",
    email: "",
    avatarUrl: null,
  });

  const selectAvatar = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("image", file);
    const res = await axios.post("/upload-avatar", formData);
    setData({ ...data, avatarUrl: res.data });
  };

  const getData = useCallback(async () => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  const saveData = async () => {
    const res = await axios.patch("/auth/me", data);
    setData(res.data);
  };

  useEffect(() => {
    getData().then();
  }, [getData]);

  useEffect(() => {
    if (!isLoading) {
      setData(userData.data);
    }
  }, [userData.data, isLoading]);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Paper className={styles.root}>
      <img
        src={baseEnvUrl + data.avatarUrl}
        alt={data.fullName}
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
        value={data.fullName}
        onChange={(event) => setData({ ...data, fullName: event.target.value })}
      />
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        className={styles.input}
        value={data.email}
        type={"email"}
        disabled
      />
      <Button
        disabled={data.fullName === ""}
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
