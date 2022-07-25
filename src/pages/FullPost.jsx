import React, { useCallback, useEffect, useState } from "react";

import { Post } from "../components";
import { Index } from "../components";
import { CommentsBlock } from "../components";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { baseEnvUrl } from "../consts";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/slices/auth";
import Grid from "@mui/material/Grid";

export const FullPost = () => {
  const isAuth = useSelector(selectIsAuth);
  const { id } = useParams();
  const [data, setData] = useState();
  const [comments, setComments] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const getData = useCallback(async () => {
    setIsLoading(true);
    await axios
      .get(`/posts/${id}`)
      .then(({ data }) => setData(data))
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, [id]);

  const getComments = useCallback(async () => {
    await axios
      .get(`posts/${id}/comments`)
      .then(({ data }) => setComments(data))
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const addComment = async (text) => {
    await axios.post(`/posts/${id}/comments`, { text });
    await getComments();
  };

  useEffect(() => {
    getData();
    getComments();
  }, [getData, getComments]);

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <Grid container spacing={4}>
      <Grid sm={8} xs={12} item>
        <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl ? baseEnvUrl + data.imageUrl : ""}
          user={data.author}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={comments?.length}
          tags={data.tags}
          isFullPost
        >
          <ReactMarkdown children={data.text} />
        </Post>
      </Grid>
      <Grid sm={4} xs={12} item>
        <CommentsBlock items={comments} isLoading={false}>
          {isAuth ? (
            <Index avatar={data.author.avatarUrl} addComment={addComment} />
          ) : (
            ""
          )}
        </CommentsBlock>
      </Grid>
    </Grid>
  );
};
