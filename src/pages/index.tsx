import * as React from "react";
import withStyles, {
  StyleRulesCallback
} from "@material-ui/core/styles/withStyles";
import withRoot from "../withRoot";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from "@material-ui/core";
import { Provider, Subscribe } from "react-contextual";

const styles: StyleRulesCallback<"root"> = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});

const State = {
  open: false,
  handleClick: () => state => ({ open: true }),
  handleClose: () => state => ({ open: false })
};

const Index = (props: any) => {
  return (
    <Provider {...State}>
      <Subscribe>
        {(state: typeof State) => {
          return (
            <div className={props.classes.root}>
              <Dialog open={state.open} onClose={state.handleClose}>
                <DialogTitle>Super Secret Password</DialogTitle>
                <DialogContent>
                  <DialogContentText>1-2-3-4-5</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={state.handleClose}>
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              <Typography variant="display1" gutterBottom>
                Material-UI
              </Typography>
              <Typography variant="subheading" gutterBottom>
                example project
              </Typography>
              <Button
                variant="raised"
                color="secondary"
                onClick={state.handleClick}
              >
                Super Secret Password
              </Button>
            </div>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

export default withRoot(withStyles(styles)(Index));
