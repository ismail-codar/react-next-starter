import * as React from "react";
import { withStyles, StyleRulesCallback } from "@material-ui/core";
// import { Provider, Subscribe } from "react-contextual";

// export const createComponent = <
//   S,
//   H extends {
//     [key: string]: (
//       ...e: any[]
//     ) => (state: S) => Partial<S> | Promise<Partial<S>>;
//   },
//   C extends StyleRulesCallback<string>
// >(
//   state: S,
//   handlers: H,
//   view: (
//     store: S & H,
//     props?: { classes: { [key in keyof ReturnType<C>]: any } }
//   ) => any,
//   classes?: C
// ): React.ComponentType<S> => {
//   const returnedView = (props: any) => {
//     let fromProps = true;
//     const select = store => {
//       if (fromProps) {
//         fromProps = false;
//         return Object.assign(store, props);
//       }
//       return Object.assign({}, props, store);
//     };
//     const viewFn = ((props, view) => {
//       return store => {
//         return view(store, props);
//       };
//     })(props, view);
//     return (
//       <Provider {...Object.assign({}, state, props, handlers)}>
//         <Subscribe select={select}>{viewFn}</Subscribe>
//       </Provider>
//     );
//   };

//   return classes
//     ? withStyles(classes, {
//         withTheme: true,
//         name: ""
//       })(returnedView)
//     : (returnedView as any);
// };

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
  self.state = Object.assign(
    {},
    self.state,
    initState ? initState(self.props) : null,
    self.props
  );
  if (handlersOut.$load) handlersOut.$load(self.state);
};

export const createComponent = <
  S,
  H extends {
    [key: string]: (state: S, ...args) => Partial<S> | Promise<Partial<S>>;
  },
  C extends StyleRulesCallback<string>
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
  options?: {
    classes?: C;
    receiveProps?: any;
    initState?: (params: S) => Partial<S>;
  }
): React.ComponentType<S> => {
  const classes = options && options.classes;
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
    // static getDerivedStateFromProps(nextProps, prevState) {
    //   console.log(nextProps, prevState);
    //   if (options && options.receiveProps) {
    //     return options.receiveProps(nextProps, prevState);
    //   } else {
    //     if (prevState !== nextProps) {
    //       var _state = {};
    //       for (var key in nextProps) {
    //         if (
    //           prevState[key] !== nextProps[key] &&
    //           !specialReactProps.includes(key)
    //         ) {
    //           //güncelleme olmuyorsa nextProps[key] object dir ve instance değişmiyordur
    //           _state[key] = nextProps[key];
    //         }
    //       }
    //       return _state;
    //     }
    //   }
    //   return null;
    // }
    render() {
      return (
        <View {...this.props} state={this.state} handlers={this.handlers} />
      );
    }
  };
};
