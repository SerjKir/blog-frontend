import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogin, setToken, fetchMe } from "../../redux/slices/auth";
import { addToken } from "../../consts";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchLogin(values));
    if (!data.payload || data.payload === "") {
      return alert("Не удалось авторизоваться");
    }
    addToken(data.payload);
    dispatch(setToken());
    await dispatch(fetchMe());
    navigate("/", { replace: true });
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          className={styles.field}
          label="E-Mail"
          fullWidth
          type={"email"}
          {...register("email", { required: "Укажите почту" })}
        />
        <TextField
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          className={styles.field}
          label="Пароль"
          fullWidth
          type={"password"}
          {...register("password", { required: "Укажите пароль" })}
        />
        <Button
          disabled={!isValid}
          type={"submit"}
          size="large"
          variant="contained"
          fullWidth
        >
          Login
        </Button>
      </form>
    </Paper>
  );
};
