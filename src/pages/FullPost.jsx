import React, { useCallback, useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { baseEnvUrl } from "../consts";

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [comments, setComments] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const getData = useCallback(async () => {
    setIsLoading(true);
    await axios
      .get(`/posts/${id}`)
      .then((res) => setData(res.data))
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    setIsLoading(false);
  }, [id]);

  const getComments = useCallback(async () => {
    await axios
      .get(`posts/${id}/comments`)
      .then(({ data }) => setComments(data))
      .catch((error) => {
        console.log(error);
        alert(error);
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
    <>
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
      <CommentsBlock items={comments} isLoading={false}>
        <Index avatar={data.author.avatarUrl} addComment={addComment} />
      </CommentsBlock>
    </>
  );
};
