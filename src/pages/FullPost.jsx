import React, { useCallback, useEffect, useState } from "react";

import { Post } from "../components";
import { Index } from "../components";
import { CommentsBlock } from "../components";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { baseEnvUrl } from "../consts";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

export const FullPost = () => {
  const userData = useSelector((state) => state.auth);
  const { id } = useParams();
  const [data, setData] = useState();
  const [comments, setComments] = useState();
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = useCallback(async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/posts/${id}`);
    setData(data);
    setIsLoading(false);
  }, [id]);

  const getComments = useCallback(async () => {
    setIsCommentsLoading(true);
    const { data } = await axios.get(`posts/${id}/comments`);
    setComments(data);
    setIsCommentsLoading(false);
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
          commentsCount={data.commentsCount}
          tags={data.tags}
          isFullPost
        >
          <ReactMarkdown children={data.text} />
        </Post>
      </Grid>
      <Grid sm={4} xs={12} item>
        <div style={{ position: "sticky", top: 0 }}>
          <CommentsBlock
            items={comments}
            isSkeleton={data.commentsCount !== 0 && isCommentsLoading}
          >
            {userData.token ? (
              <Index avatar={userData.data.avatarUrl} addComment={addComment} />
            ) : (
              ""
            )}
          </CommentsBlock>
        </div>
      </Grid>
    </Grid>
  );
};
