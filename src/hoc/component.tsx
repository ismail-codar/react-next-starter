import * as React from "react";
import { withStyles, StyleRulesCallback } from "@material-ui/core";
import { Provider, Subscribe } from "react-contextual";

export const createComponent = <
  S,
  H extends {
    [key: string]: (e?: any) => (state: S) => Partial<S> | Promise<Partial<S>>;
  },
  C extends StyleRulesCallback<string>
>(
  state: S,
  handlers: H,
  view: (
    store: S & H,
    props?: { classes: { [key in keyof ReturnType<C>]: any } }
  ) => any,
  classes?: C
): React.ComponentType<S> => {
  const returnedView = (props: any) => {
    let fromProps = true;
    const select = store => {
      if (fromProps) {
        fromProps = false;
        return Object.assign(store, props);
      }
      return Object.assign({}, props, store);
    };
    const viewFn = ((props, view) => {
      return store => {
        return view(store, props);
      };
    })(props, view);
    return (
      <Provider {...Object.assign({}, state, props, handlers)}>
        <Subscribe select={select}>{viewFn}</Subscribe>
      </Provider>
    );
  };

  return classes
    ? withStyles(classes, {
        withTheme: true,
        name: ""
      })(returnedView)
    : (returnedView as any);
};
