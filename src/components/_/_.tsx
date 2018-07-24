import * as React from "react";
import { createComponent } from "../../../app-packages/sis/hoc/component";

export const MyComponent = createComponent(
  {},
  {},
  () => {
    return <div>DEMO</div>;
  },
  {
    classes: theme => ({
      root: {
        width: "100%"
      }
    })
  }
);
