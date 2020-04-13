import * as React from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { DisplayPerson } from "./PeopleTable";

export interface CommentProps {
  person: DisplayPerson;
  isOwned: boolean;
}

export interface CommentState {}

export default function Comment(props: CommentProps) {
  const [commentText, setCommentText] = React.useState<string>(props.person.comment ? props.person.comment : "");

  const updateCommentInServer = async () => {
    props.person.comment = commentText;
    try {
      await axios.put("/people", { newData: props.person });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TextField
      label="Comment"
      multiline
      rows={1}
      rowsMax={7}
      fullWidth
      value={commentText}
      onChange={(event) => {
        setCommentText(event.target.value);
      }}
      inputProps={{
        onBlur: () => {
          updateCommentInServer();
        },
      }}
      style={{ margin: "5px 0px 5px 10px", width: "95%" }}
      disabled={!props.isOwned}
    />
  );
}
