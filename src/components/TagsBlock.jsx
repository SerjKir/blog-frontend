import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import styles from "./Components.module.scss";

import { SideBlock } from "./SideBlock";
import { NavLink } from "react-router-dom";
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
          <ListItem key={i} disablePadding>
            <NavLink
              to={`/tags/${name}`}
              onClick={resetPage}
              className={styles.tagsLink}
              style={({ isActive }) => ({
                color: isActive ? "blue" : "black",
              })}
            >
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} height={32} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
