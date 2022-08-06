import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useNavigate, useParams } from "react-router-dom";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { baseEnvUrl } from "../../consts";
import { LinearProgress } from "@mui/material";
import {
  addPost,
  getPost,
  updatePost,
  uploadPostImage,
} from "../../api/postApi";
import { useDispatch, useSelector } from "react-redux";
import { check } from "../../redux/slices/auth";

export const AddPost = () => {
  const dispatch = useDispatch();
  const { token, status } = useSelector((state) => state.auth);
  const isLoading = status === "loading";
  const isAuth = !!token;
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const inputFileRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const isEditing = !!id;

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const data = await uploadPostImage(formData);
      setImageUrl(data);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "postEditor",
      },
    }),
    []
  );

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        text,
        tags,
      };
      const { data } = isEditing
        ? await updatePost(id, fields)
        : await addPost(fields);
      const _id = isEditing ? id : data;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Failed to create post");
    }
  };

  const getData = useCallback(async () => {
    const data = await getPost(id);
    setTitle(data.title);
    setText(data.text);
    setImageUrl(data.imageUrl);
    setTags(data.tags?.join(","));
  }, [id]);

  const checkIsAuth = useCallback(async () => {
    await dispatch(check());
  }, [dispatch]);

  useEffect(() => {
    checkIsAuth().then();
  }, [checkIsAuth]);

  useEffect(() => {
    if (id) {
      getData().then();
    }
  }, [getData, id]);

  if (isLoading || !isAuth) {
    return <LinearProgress />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Load image
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={baseEnvUrl + imageUrl}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
        id="postEditor"
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Publish"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
