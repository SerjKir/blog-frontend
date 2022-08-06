import React, { useCallback, useEffect, useState } from "react";

import { Post } from "../components";
import { Index } from "../components";
import { CommentsBlock } from "../components";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { baseEnvUrl } from "../consts";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { addComment, getPost, getPostComments } from "../api/postApi";

export const FullPost = () => {
  const { token, data } = useSelector((state) => state.auth);
  const isAuth = !!token;
  const { id } = useParams();
  const [userData, setUserData] = useState();
  const [comments, setComments] = useState();
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = useCallback(async () => {
    setIsLoading(true);
    const data = await getPost(id);
    setUserData(data);
    setIsLoading(false);
  }, [id]);

  const getComments = useCallback(async () => {
    setIsCommentsLoading(true);
    const data = await getPostComments(id);
    setComments(data);
    setIsCommentsLoading(false);
  }, [id]);

  const handleAddComment = async (text) => {
    await addComment(id, text);
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
          id={userData._id}
          title={userData.title}
          imageUrl={userData.imageUrl ? baseEnvUrl + userData.imageUrl : ""}
          user={userData.author}
          createdAt={userData.createdAt}
          viewsCount={userData.viewsCount}
          commentsCount={userData.commentsCount}
          tags={userData.tags}
          isFullPost
        >
          <ReactMarkdown children={userData.text} />
        </Post>
      </Grid>
      <Grid sm={4} xs={12} item>
        <div style={{ position: "sticky", top: 0 }}>
          <CommentsBlock
            items={comments}
            isSkeleton={userData.commentsCount !== 0 && isCommentsLoading}
          >
            {isAuth && (
              <Index avatar={data.avatarUrl} addComment={handleAddComment} />
            )}
          </CommentsBlock>
        </div>
      </Grid>
    </Grid>
  );
};
