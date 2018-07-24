import * as React from "react";
import { MyComponent } from "./_";

const componentDemo = (data: any) => (
  <div>
    <hr />
    <MyComponent />
  </div>
);

export = () => {
  return {
    "Demo 1": componentDemo({})
  };
};
