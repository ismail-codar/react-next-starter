import * as React from "react";
import withStyles, {
  StyleRulesCallback
} from "@material-ui/core/styles/withStyles";
import withRoot from "../withRoot";
import { Button, Input, InputLabel } from "@material-ui/core";
import { createComponent } from "../hoc/component";

const Counter = createComponent(
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

const CounterParent = createComponent(
  { startCount: 0 },
  {
    handleChangeStart: (state, binded, e) => ({
      startCount: parseInt(e.target.value)
    })
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

const Index = createComponent(
  {},
  {
    handleClick: state => ({ open: true }),
    handleClose: state => ({ open: false })
  },
  props => {
    return (
      <div className={props.classes.root}>
        <CounterParent startCount={0} />
      </div>
    );
  },
  {
    classes: (theme => ({
      root: {
        textAlign: "center",
        paddingTop: theme.spacing.unit * 20
      }
    })) as StyleRulesCallback<"root">
  }
);
export default withRoot(Index);
