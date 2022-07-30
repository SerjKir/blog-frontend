import React, { useCallback, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { TagsBlock, Post, CommentsBlock } from "../components";
import {
  fetchLastComments,
  fetchPosts,
  fetchPostsByTag,
  fetchLastTags,
  setCurrentPage,
  setSortType,
  sort,
} from "../redux/slices/posts";
import { baseEnvUrl } from "../consts";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments, sortType, currentPage, total } = useSelector(
    (state) => state.posts
  );
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = comments.status === "loading";
  const { id } = useParams();
  const pageLimit = 5,
    commentsLimit = 3,
    tagsLimit = 5;
  const isSkeleton = isPostsLoading && posts.items.length === 0;

  const handleChange = (event, newValue) => {
    dispatch(setSortType(newValue));
  };

  const loadMore = () => {
    dispatch(setCurrentPage());
  };

  const getData = useCallback(async () => {
    window.location.pathname.includes("/tags/")
      ? dispatch(fetchPostsByTag({ id, page: currentPage, limit: pageLimit }))
      : dispatch(fetchPosts({ page: currentPage, limit: pageLimit }));
    dispatch(fetchLastTags({ limit: tagsLimit }));
    dispatch(fetchLastComments({ limit: commentsLimit }));
  }, [dispatch, id, currentPage]);

  useEffect(() => {
    getData().then();
  }, [getData]);

  useEffect(() => {
    if (!isPostsLoading) {
      dispatch(sort());
    }
  }, [sortType, isPostsLoading, dispatch]);

  return (
    <>
      <Tabs
        value={sortType}
        style={{ marginBottom: 15 }}
        aria-label="basic tabs example"
        onChange={handleChange}
      >
        <Tab label="New" value={"createdAt"} />
        <Tab label="Popular" value={"viewsCount"} />
        <Tab label="Most commented" value={"comments"} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid sm={8} xs={12} item>
          {(isSkeleton ? [...Array(pageLimit)] : posts.items).map(
            (item, index) =>
              isSkeleton ? (
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
          <Button
            style={{
              visibility:
                Math.ceil(total / pageLimit) > currentPage
                  ? "visible"
                  : "hidden",
            }}
            variant="contained"
            onClick={loadMore}
          >
            Load more
          </Button>
        </Grid>
        <Grid sm={4} xs={12} item>
          <div style={{ position: "sticky", top: 0 }}>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
            <CommentsBlock
              items={comments.items}
              isLoading={isCommentsLoading}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
