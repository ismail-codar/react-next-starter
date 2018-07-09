import * as React from "react";
import { Theme, withStyles } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Provider, Subscribe } from "react-contextual";

export type CssType = { [key: string]: CSSProperties };
export type ThemedCssType = (theme: Theme) => CssType;

export const createComponent = <
  S,
  H extends {
    [key: string]: (e?: any) => (state: S) => Partial<S> | Promise<Partial<S>>;
  },
  C extends ThemedCssType
>(
  state: S,
  handlers: H,
  view: (
    stateWithHandlers: S & H,
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
      return stateWithHandlers => {
        return view(stateWithHandlers, props);
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

const specialReactProps = ["children", "state", "handlers", "$load"];
export const isPromise = obj => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};

export const initComponent = (self, initState, handlers) => {
  const handlersOut = { $load: null };
  const callback = data => {
    data && self.setState(data);
  };
  //$load in çalışmaması istendiğinde $load={null} verilebilir
  if (self.props.$load !== undefined) handlers.$load = self.props.$load;
  for (var key in handlers) {
    (function(key, handler) {
      if (handler)
        handlersOut[key] = function(...args) {
          const ret = this
            ? handler(self.state, this, ...args)
            : handler(self.state, ...args);
          if (isPromise(ret)) {
            ret.then(data => callback(data));
          } else callback(ret);
        };
    })(key, handlers[key]);
  }

  self.handlers = handlersOut;
  if (self.props.handlers) {
    // props.handlers.xxxMethod çağrılacaksa handlers={{} as any} şeklinde atama gerekir
    Object.assign(self.props.handlers, handlersOut);
  }
  // self.state = {
  //   ...self.state,
  //   ...(initState ? initState(self.props) : null),
  //   ...self.props
  // };
  self.state = Object.assign(
    {},
    self.state,
    initState ? initState(self.props) : null,
    self.props
  );
  if (handlersOut.$load) handlersOut.$load(self.state);
};

export const withPureComponent = <
  S,
  H extends {
    [key: string]: (state: S, ...args) => Partial<S> | Promise<Partial<S>>;
  },
  C extends ThemedCssType
>(
  state: S,
  handlers: H,
  view: (
    props: {
      state: S;
      handlers: { [key in keyof H]: (e) => any };
      classes: { [key in keyof ReturnType<C>]: any };
    }
  ) => any,
  classes?: C,
  options?: {
    receiveProps?: any;
    initState?: (params: S) => Partial<S>;
  }
): React.ComponentType<S> => {
  const View = classes
    ? withStyles(classes, {
        withTheme: true,
        name: ""
      })(view)
    : view;

  return class extends React.PureComponent<S, S> {
    classes: any;
    handlers: any;
    state = state;
    constructor(props) {
      super(props);
      initComponent(
        this,
        options ? options.initState : null,
        Object.assign({}, handlers) //Object. assign ile vermek mutlak gerekli
      );
    }
    // static getDerivedStateFromProps(props, state) {
    //   console.log(props, state);
    //   if (options && options.receiveProps) {
    //     return options.receiveProps(props, state);
    //   } else {
    //     if (state !== props) {
    //       var _state = {};
    //       for (var key in props) {
    //         if (state[key] !== props[key] && !specialReactProps.includes(key)) {
    //           _state[key] = props[key];
    //         }
    //       }
    //       return _state;
    //     }
    //   }
    //   return null;
    // }
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (options && options.receiveProps) {
        options.receiveProps(this.state, nextProps);
      } else {
        if (this.props !== nextProps) {
          for (var key in nextProps) {
            if (
              this.props[key] !== nextProps[key] &&
              !specialReactProps.includes(key)
            ) {
              //güncelleme olmuyorsa nextProps[key] object dir ve instance değişmiyordur
              this.state[key] = nextProps[key];
            }
          }
        }
      }
    }
    render() {
      return (
        <View {...this.props} state={this.state} handlers={this.handlers} />
      );
    }
  };
};
