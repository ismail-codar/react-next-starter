import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";

const closeDemo = e => {
  e.preventDefault();
  fetch("/close/demo");
};
export const renderDemoList = (demoList: {
  [key: string]: HTMLElement;
}): any[] => {
  return Object.keys(demoList).map(key => {
    return (
      <div key={key}>
        <h3>{key}</h3>
        <div
          style={{
            backgroundColor: "white"
          }}
        >
          {demoList[key]}
        </div>
      </div>
    );
  });
};

const runDemoItems = (mainDiv: HTMLElement, demoList) => {
  if (Object.keys(demoList).length == 0) return;
  ReactDOM.render(
    <div
      style={{
        margin: "10px",
        height: "calc(100% - 60px)",
        width: "calc(100% - 20px)",
        border: "solid 1px gray"
      }}
    >
      <button
        onClick={closeDemo}
        style={{
          float: "right",
          backgroundColor: "red",
          color: "white",
          fontSize: "26px",
          borderColor: "red",
          cursor: "pointer",
          position: "relative",
          zIndex: 100000
        }}
      >
        X
      </button>
      <div id="mocha" />
      {renderDemoList(demoList)}
    </div>,
    mainDiv
  );
};

export const runDemo = (
  name: string,
  activeDemo: {
    view: () => { [key: string]: HTMLElement };
  }
) => {
  const mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";
  const demoList = activeDemo.view["demoList"]
    ? activeDemo.view["demoList"]()
    : activeDemo.view();
  if (demoList instanceof Promise) {
    demoList.then(list => {
      runDemoItems(mainDiv, list);
    });
  } else runDemoItems(mainDiv, demoList);
  setTimeout(() => {
    var w = window.open("", "", "width=100,height=100,left=3000");
    if (w) {
      w.focus();
      setTimeout(function() {
        w.close();
      }, 1);
    }
  }, 1);
};

const DemoApp = ({ demo }) => {
  const demoList = demo.view["demoList"]
    ? demo.view["demoList"]()
    : demo.view();

  return (
    <div
      style={{
        margin: "10px",
        height: "calc(100% - 60px)",
        width: "calc(100% - 20px)",
        border: "solid 1px gray"
      }}
    >
      <button
        onClick={closeDemo}
        style={{
          float: "right",
          backgroundColor: "red",
          color: "white",
          fontSize: "26px",
          borderColor: "red",
          cursor: "pointer",
          position: "relative",
          zIndex: 100000
        }}
      >
        X
      </button>
      <div id="mocha" />
      {Object.keys(demoList).map(key => {
        return (
          <div key={key}>
            <h3>{key}</h3>
            <div
              style={{
                backgroundColor: "white"
              }}
            >
              {demoList[key]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default hot(module)(DemoApp);
