import * as React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const Input = styled.input`
  display: none;
`;

export interface FileInputProps {
  handleFileSelected: Function;
}

export default class FileInput extends React.Component<FileInputProps, any> {
  render() {
    return (
      <React.Fragment>
        <Input accept=".csv" id="uploadInput" type="file" onChange={event => this.props.handleFileSelected(event.target.files![0])} />
        <label htmlFor="uploadInput">
          <Button color="primary" component="span">
            Select File
          </Button>
        </label>
      </React.Fragment>
    );
  }
}
