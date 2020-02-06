import React from "react";
import MaterialTable, { Column } from "material-table";
import { Container } from "@material-ui/core";
import EditableObject from "./EditableObject";
import ActionsObject from "./ActionsObject";

// Make abstract class
export default abstract class ATable<T extends Object> extends React.Component<TableProps, TableState<T>> {
    abstract get editableObject() : EditableObject<T>
    abstract get actionsObject() : ActionsObject<T>
    abstract get name() : string
    render() {
        return (
            <Container>
                <MaterialTable
                columns={this.state.columns}
                data={this.state.data}
                editable={this.editableObject}
                title={this.name}
                actions={this.actionsObject.actions}
                />
            </Container>
        )
    }
}

export interface TableProps {
    
}

export interface TableState<T extends Object> {
    data: T[];
    columns: Array<Column<T>>;
  }