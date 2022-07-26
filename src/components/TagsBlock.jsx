import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCurrentPage } from "../redux/slices/posts";

export const TagsBlock = ({ items, isLoading = true }) => {
  const dispatch = useDispatch();
  const resetPage = () => {
    dispatch(resetCurrentPage());
  };
  return (
    <SideBlock title="Tags">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <Link
            to={`/tags/${name}`}
            key={i}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem key={i} disablePadding>
              <ListItemButton onClick={resetPage}>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
