import React, { useCallback, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags, sort } from "../redux/slices/posts";
import axios from "../axios";
import { baseEnvUrl } from "../consts";
export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [comments, setComments] = useState([]);
  const [sortValue, setSortValue] = useState("createdAt");

  const getComments = useCallback(async () => {
    await axios.get("/comments").then(({ data }) => setComments(data));
  }, []);

  const handleChange = (event, newValue) => {
    setSortValue(newValue);
  };

  useEffect(() => {
    dispatch(sort(sortValue));
  }, [sortValue, dispatch]);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    getComments();
  }, [dispatch, getComments]);

  return (
    <>
      <Tabs
        value={sortValue}
        style={{ marginBottom: 15 }}
        aria-label="basic tabs example"
        onChange={handleChange}
      >
        <Tab label="Новые" value={"createdAt"} />
        <Tab label="Популярные" value={"viewsCount"} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((item, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={item._id}
                title={item.title}
                imageUrl={item.imageUrl ? `${baseEnvUrl}${item.imageUrl}` : ""}
                user={item.author}
                createdAt={item.createdAt}
                viewsCount={item.viewsCount}
                commentsCount={3}
                tags={item.tags}
                isEditable={userData?._id === item.author._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
