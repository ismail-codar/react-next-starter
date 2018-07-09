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
    handleIncrease: () => state => ({ count: state.count + 1 }),
    handleDecrease: () => state => ({ count: state.count - 1 })
  },
  store => (
    <>
      <Button onClick={store.handleDecrease} mini>
        -
      </Button>
      {store.count}
      <Button onClick={store.handleIncrease} mini>
        +
      </Button>
    </>
  )
);

const CounterParent = createComponent(
  { startCount: 0 },
  {
    handleChangeStart: e => state => ({
      startCount: parseInt(e.target.value)
    })
  },
  store => (
    <div>
      <InputLabel>
        Start:{" "}
        <Input
          type="number"
          value={store.startCount}
          onChange={store.handleChangeStart}
        />
      </InputLabel>
      <br />
      <Counter count={store.startCount} />
    </div>
  )
);

const Index = createComponent(
  {},
  {
    handleClick: () => state => ({ open: true }),
    handleClose: () => state => ({ open: false })
  },
  (store, props) => {
    return (
      <div className={props.classes.root}>
        <CounterParent startCount={0} />
      </div>
    );
  },
  (theme => ({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing.unit * 20
    }
  })) as StyleRulesCallback<"root">
);
export default withRoot(Index);

declare type C = (theme) => { root: null };
const classes: { [key in keyof ReturnType<C>]: any } = null;
