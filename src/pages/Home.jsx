import React, { useCallback, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { TagsBlock, Post, CommentsBlock } from "../components";
import {
  fetchPosts,
  fetchPostsByTag,
  fetchTags,
  sort,
} from "../redux/slices/posts";
import axios from "../axios";
import { baseEnvUrl } from "../consts";
import { useParams } from "react-router-dom";
export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [comments, setComments] = useState([]);
  const [sortValue, setSortValue] = useState("createdAt");
  const { id } = useParams();

  const getComments = useCallback(async () => {
    await axios.get("/posts/comments").then(({ data }) => setComments(data));
  }, []);

  const handleChange = (event, newValue) => {
    setSortValue(newValue);
  };

  useEffect(() => {
    dispatch(sort(sortValue));
  }, [sortValue, dispatch]);

  useEffect(() => {
    if (window.location.pathname.includes("/tags/")) {
      dispatch(fetchPostsByTag(id));
    } else {
      dispatch(fetchPosts());
    }
    dispatch(fetchTags());
  }, [dispatch, id]);

  useEffect(() => {
    getComments().then();
  }, [getComments]);

  return (
    <>
      <Tabs
        value={sortValue}
        style={{ marginBottom: 15 }}
        aria-label="basic tabs example"
        onChange={handleChange}
      >
        <Tab label="New" value={"createdAt"} />
        <Tab label="Popular" value={"viewsCount"} />
        <Tab label="Most viewed" value={"comments"} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid sm={8} xs={12} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((item, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={item._id}
                title={item.title}
                imageUrl={item.imageUrl ? baseEnvUrl + item.imageUrl : ""}
                user={item.author}
                createdAt={item.createdAt}
                viewsCount={item.viewsCount}
                commentsCount={item.comments?.length}
                tags={item.tags}
                isEditable={userData?._id === item.author._id}
              />
            )
          )}
        </Grid>
        <Grid sm={4} xs={12} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
