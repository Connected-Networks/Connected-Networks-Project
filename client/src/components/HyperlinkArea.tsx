import * as React from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { DisplayPerson } from "./PeopleTable";

export interface HyperlinkAreaProps {
  person: DisplayPerson;
}

export default function HyperlinkArea(props: HyperlinkAreaProps) {
  const [hyperlinkText, setHyperlinkText] = React.useState<string>(props.person.hyperlink);

  const updateCommentInServer = async () => {
    props.person.hyperlink = hyperlinkText;
    try {
      await axios.put("/people", { newData: props.person });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TextField
      label="LinkedIn URL"
      value={hyperlinkText}
      onChange={(event) => {
        setHyperlinkText(event.target.value);
      }}
      inputProps={{
        onBlur: () => {
          updateCommentInServer();
        },
      }}
      style={{ margin: "10px 0px 5px 10px", width: "95%" }}
    />
  );
}
