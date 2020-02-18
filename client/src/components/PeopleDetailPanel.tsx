import React from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import EmploymentHistoryTable from "./EmployeementHistoryTable";

export interface DetailPanelState {
    value: string;
}

export interface DetailPanelProps {
    personId: number;
    personComment: string;
}

export default class PeopleDetailPanel extends React.Component<DetailPanelProps, DetailPanelState> {
    
    state = {
        value: this.props.personComment
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState( {value: event.target.value} );
    };


    render() {
        return (
            <div style={{ marginLeft: "60px", boxShadow: "0px 0px 5px"}}>
                <Grid
                container
                direction="row"
                justify="flex-start"
                // spacing={3}
                >
                    <Grid item xs={10}>
                        <TextField style={{ margin: "20px 10px"}}
                            id="filled-multiline-flexible"
                            label="Comment"
                            placeholder="Type your comment here..."
                            multiline
                            rowsMax="4"
                            value={this.state.value}
                            onChange={this.handleChange}
                            variant="filled"
                            color="primary"
                            fullWidth = {true}
                        />
                    </Grid>
                    <Grid
                    container
                    justify="center"
                    alignItems="center"
                    direction="column"
                    xs = {2}
                    >
                        <Grid item  spacing={1}>
                            <Button variant="contained">
                            Save
                            </Button>                    
                        </Grid>
                        <Grid item spacing={1}>
                            <Button variant="contained" color="secondary">
                            Cancel
                            </Button>  
                        </Grid>                  
                    </Grid>
                </Grid>

              
              <EmploymentHistoryTable dataEndPoint={"/history/" + this.props.personId} />
            </div>
          );
    }
}