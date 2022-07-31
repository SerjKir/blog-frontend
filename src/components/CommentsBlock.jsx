import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { baseEnvUrl } from "../consts";

export const CommentsBlock = ({ items, children, isSkeleton = true }) => {
  return (
    <SideBlock title="Comments">
      <List>
        {(isSkeleton ? [...Array(3)] : items)?.map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isSkeleton ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={obj.author.fullName}
                    src={baseEnvUrl + obj.author.avatarUrl}
                  />
                )}
              </ListItemAvatar>
              {isSkeleton ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={24} width={80} />
                  <Skeleton variant="text" height={20} width={160} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.author.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant={"fullWidth"} component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
