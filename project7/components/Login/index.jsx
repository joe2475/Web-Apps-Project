import React, {useState, useContext} from "react";
import { AppBar, Toolbar, Typography, Switch, FormGroup, FormControlLabel } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";

import axios from "axios";
import useStateContext from "../Context";

function Login(){

    const {setUsername} = useStateContext(); // get flags

    return(
        <div>
            <button onClick={() => {
                axios.post("/admin/login").then(
                function(success){
                    console.log("posted login"); 
                    setUsername("username");
                },
                (failure) => {console.log(failure);  }
                );
            }}>login</button>
            <button onClick={() => {
                axios.post("/admin/logout").then(
                function(success){
                    console.log("posted logout"); 
                    setUsername(undefined);
                },
                (failure) => {console.log(failure);  }
                );
            }}>logout</button>
        </div>
    );
}

export default Login;