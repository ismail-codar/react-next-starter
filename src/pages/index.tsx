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
  Typography,
  Input,
  InputLabel
} from "@material-ui/core";
import { Provider, Subscribe } from "react-contextual";
import { createComponent, withPureComponent } from "../hoc/component";

const styles: StyleRulesCallback<"root"> = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});

const State = {
  open: false
};

const StateHandlers = {
  handleClick: () => state => ({ open: true }),
  handleClose: () => state => ({ open: false })
};

const Index = (props: any) => {
  return (
    <Provider {...{ ...State, ...StateHandlers }}>
      <Subscribe>
        {(state: typeof State & typeof StateHandlers) => {
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

// export default withRoot(withStyles(styles)(Index));

const Counter = withPureComponent(
  { count: 0 },
  {
    handleIncrease: state => ({ count: state.count + 1 }),
    handleDecrease: state => ({ count: state.count - 1 })
  },
  props => (
    <>
      <Button onClick={props.handlers.handleDecrease} mini>
        -
      </Button>
      {props.state.count}
      <Button onClick={props.handlers.handleIncrease} mini>
        +
      </Button>
    </>
  )
);

const CounterParent = withPureComponent(
  { startCount: 0 },
  {
    handleChangeStart: (state, binded, e) => {
      return {
        startCount: parseInt(e.target.value)
      };
    }
  },
  props => (
    <div>
      <InputLabel>
        Start:{" "}
        <Input
          type="number"
          value={props.state.startCount}
          onChange={props.handlers.handleChangeStart}
        />
      </InputLabel>
      <br />
      <Counter count={props.state.startCount} />
    </div>
  )
);

const Index2 = withPureComponent(
  {
    open: false
  },
  {
    // handleClick: () => state => ({ open: true }),
    // handleClose: () => state => ({ open: false })
    handleClick: state => ({ open: true }),
    handleClose: state => ({ open: false })
  },
  state => {
    return (
      <div className={state.classes.root}>
        <CounterParent startCount={0} />
      </div>
    );
  },
  theme => ({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing.unit * 20
    }
  })
);
export default withRoot(Index2);
