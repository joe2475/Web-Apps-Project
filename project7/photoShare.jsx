"use strict";

import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/main.css";
import App from "./components/App";
import {Context} from "./components/Context";

// app
function PhotoShare() {

  // render display
  return (
    <Context>
      <App />
    </Context>
  );
}


const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
