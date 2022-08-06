import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchMe, fetchRegister, setToken } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addToken } from "../../consts";

export const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload || data.payload === "") {
      return alert("Не удалось зарегестрироваться");
    }
    addToken(data.payload);
    dispatch(setToken());
    await dispatch(fetchMe());
    navigate("/", { replace: true });
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          className={styles.field}
          label="Полное имя"
          fullWidth
          {...register("fullName", { required: "Укажите имя" })}
        />
        <TextField
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          type={"email"}
          className={styles.field}
          label="E-Mail"
          fullWidth
          {...register("email", { required: "Укажите почту" })}
        />
        <TextField
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          type={"password"}
          className={styles.field}
          label="Пароль"
          fullWidth
          {...register("password", { required: "Укажите пароль" })}
        />
        <Button
          disabled={!isValid}
          type={"submit"}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
