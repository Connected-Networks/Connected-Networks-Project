import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export interface AlertDialogProps {
  title: string;
  description: string;
  agreeOptionText: string;
  handleAgreeOption: Function;
  handleClose: any;
  open?: boolean;
}

export default function AlertDialog(props: AlertDialogProps) {
  const [open, setOpen] = React.useState(props.open ? props.open : true);

  const handleAgreeSuper = () => {
    props.handleAgreeOption();
    props.handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAgreeSuper} color="secondary" autoFocus>
            {props.agreeOptionText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
