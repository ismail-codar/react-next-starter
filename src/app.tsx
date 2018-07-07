import * as React from "react";
import { hot } from "react-hot-loader";

class Test {
  public tarih = new Date();
}

const App = () => <div>App. {new Test().tarih.getTime()}</div>;

export default hot(module)(App);
