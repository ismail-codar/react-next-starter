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
import { POINT_CONVERSION_UNCOMPRESSED } from "constants";

const styles: StyleRulesCallback<"root"> = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});

/*
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


const counterStore = {
  count: 0,
  internal: false,
  handleIncrease: () => state => ({ count: state.count + 1 }),
  handleDecrease: () => state => ({ count: state.count - 1 })
};

const counterParentStore = {
  startCount: 0,
  handleChangeStart: e => state => {
    return {
      startCount: parseInt(e.target.value)
    };
  }
};

const Counter = props => {
  let fromProps = true;
  const select = store => {
    if (fromProps) {
      fromProps = false;
      return Object.assign(store, props);
    }
    return Object.assign({}, props, store);
  };
  return (
    <Provider {...counterStore}>
      <Subscribe select={select}>
        {(state: typeof counterStore) => {
          return (
            <>
              <Button onClick={state.handleDecrease} mini>
                -
              </Button>
              {state.count}
              <Button onClick={state.handleIncrease} mini>
                +
              </Button>
            </>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

const CounterParent = props => {
  return (
    <Provider {...counterParentStore}>
      <Subscribe>
        {(state: typeof counterParentStore) => {
          return (
            <div>
              <InputLabel>
                Start:{" "}
                <Input
                  type="number"
                  value={state.startCount}
                  onChange={state.handleChangeStart}
                />
              </InputLabel>
              <br />
              <Counter count={state.startCount} />
            </div>
          );
        }}
      </Subscribe>
    </Provider>
  );
};
*/

const Counter = createComponent(
  { count: 0 },
  {
    handleIncrease: () => state => ({ count: state.count + 1 }),
    handleDecrease: () => state => ({ count: state.count - 1 })
  },
  state => (
    <>
      <Button onClick={state.handleDecrease} mini>
        -
      </Button>
      {state.count}
      <Button onClick={state.handleIncrease} mini>
        +
      </Button>
    </>
  )
);

const CounterParent = createComponent(
  { startCount: 0 },
  {
    handleChangeStart: e => state => {
      return {
        startCount: parseInt(e.target.value)
      };
    }
  },
  state => (
    <div>
      <InputLabel>
        Start:{" "}
        <Input
          type="number"
          value={state.startCount}
          onChange={state.handleChangeStart}
        />
      </InputLabel>
      <br />
      <Counter count={state.startCount} />
    </div>
  )
);

const Index = withPureComponent(
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
export default withRoot(Index);
