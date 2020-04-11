import * as React from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { DisplayPerson } from "./PeopleTable";

export interface CommentProps {
  person: DisplayPerson;
}

export interface CommentState {}

export default function Comment(props: CommentProps) {
  const [commentText, setCommentText] = React.useState<string>(props.person.comment);

  const updateCommentInServer = async () => {
    props.person.comment = commentText;
    try {
      await axios.put("/people", { newData: { ...props.person, hyperlink: "" } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TextField
      label="Comment"
      multiline
      rows={2}
      rowsMax={7}
      fullWidth
      value={props.person.comment}
      variant="filled"
      onChange={(event) => {
        setCommentText(event.target.value);
      }}
      inputProps={{
        onBlur: () => {
          updateCommentInServer();
        },
      }}
    />
  );
}
