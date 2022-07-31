import React, { useCallback, useEffect, useRef } from "react";
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
  resetDefault,
} from "../redux/slices/posts";
import { baseEnvUrl } from "../consts";
import { useParams } from "react-router-dom";
export const Home = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments, sortType, currentPage, total } = useSelector(
    (state) => state.posts
  );

  const pageLimit = 5,
    commentsLimit = 3,
    tagsLimit = 5;

  const isPostSkeleton = posts.status === "loading" && posts.items.length === 0,
    isTagsSkeleton = tags.status === "loading" && tags.items.length === 0,
    isCommentsSkeleton =
      comments.status === "loading" && comments.items.length === 0;

  const isNotLastPage = Math.ceil(total / pageLimit) > currentPage;

  const handleChange = (event, newValue) => {
    dispatch(setSortType(newValue));
    dispatch(resetDefault());
  };

  const getData = useCallback(async () => {
    window.location.pathname.includes("/tags/")
      ? dispatch(
          fetchPostsByTag({
            id,
            sort: sortType,
            page: currentPage,
            limit: pageLimit,
          })
        )
      : dispatch(
          fetchPosts({ sort: sortType, page: currentPage, limit: pageLimit })
        );
    dispatch(fetchLastTags({ limit: tagsLimit }));
    dispatch(fetchLastComments({ limit: commentsLimit }));
  }, [dispatch, id, currentPage, sortType]);

  const inputRef = useRef();
  useEffect(() => {
    if (isNotLastPage && inputRef.current) {
      const observer = new IntersectionObserver((entries, callback) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          observer.unobserve(inputRef.current);
          dispatch(setCurrentPage());
        }
      });
      observer.observe(inputRef.current);
    }
  }, [dispatch, isNotLastPage, posts.items]);

  useEffect(() => {
    getData().then();
  }, [getData]);

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
        <Tab label="Most commented" value={"commentsCount"} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid sm={8} xs={12} item>
          {(isPostSkeleton ? [...Array(pageLimit)] : posts.items).map(
            (item, index) =>
              isPostSkeleton ? (
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
                  commentsCount={item.commentsCount}
                  tags={item.tags}
                  isEditable={userData?._id === item.author._id}
                  inputRef={index === posts.items.length - 1 ? inputRef : null}
                />
              )
          )}
        </Grid>
        <Grid sm={4} xs={12} item>
          <div style={{ position: "sticky", top: 0 }}>
            <TagsBlock items={tags.items} isSkeleton={isTagsSkeleton} />
            <CommentsBlock
              items={comments.items}
              isSkeleton={isCommentsSkeleton}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
