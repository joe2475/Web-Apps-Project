import React, {useState, useContext} from "react";
import { Button, TextField, AppBar, Toolbar, Typography, Switch, FormGroup, FormControlLabel } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";

import axios from "axios";
import useStateContext from "../Context";

export function Logout(){
    const {username, setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags
    // logout post
    axios.post("/admin/logout").then(
        function(success){
            console.log("posted logout"); 
            setUsername(undefined);
            setFirstname(undefined);
            setLastname(undefined);
            setUser_id(undefined);
        },
        (failure) => {console.log(failure);  }
        );
}

function Login(){
    const [localUsername, setLocalUsername] = useState("");
    const {username, setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags

    // login post
    function login_request(){
        axios.post("/admin/login", {'login_name': localUsername}).then(
            function(success){
                const user = success.data;
                //console.log(user);
                setUsername(user.login_name);
                setFirstname(user.firstname);
                setLastname(user.lastname);
                setUser_id(user._id);
                
                console.log("posted login");
            },
            (failure) => {console.log(failure);  }
            );
    }

    // logout post
    function logout_request(){
        axios.post("/admin/logout").then(
            function(success){
                console.log("posted logout"); 
                setUsername(undefined);
                setFirstname(undefined);
                setLastname(undefined);
                setUser_id(undefined);
            },
            (failure) => {console.log(failure);  }
            );
    }

    return(
        <>
            <TextField required id="outlined-basic" label="Username" variant="outlined" className="m-3"
            onChange={(event) => {setLocalUsername(event.target.value)}} />
            <Button variant="contained" onClick={() => {login_request();}} className="m-3">
                login
            </Button>
        </>
    );
}

export default Login;