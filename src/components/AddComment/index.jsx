import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { baseEnvUrl } from "../../consts";

export const Index = ({ avatar, addComment }) => {
  const [text, setText] = useState("");
  const addCommentHandler = () => {
    addComment(text);
    setText("");
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`${baseEnvUrl}${avatar}`}
        />
        <div className={styles.form}>
          <TextField
            onChange={(e) => setText(e.target.value)}
            value={text}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={addCommentHandler} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
