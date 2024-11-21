"use strict";

import React, {useState} from "react";
import { Button, TextField, Typography} from "@mui/material";

import axios from "axios";
import useStateContext from "../Context";

export function Logout(){
    const {username, setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags
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
    };

    return(
        <>
            {username? <Button variant="contained" color="error" onClick={() => {logout_request()}} sx={{ m: 2 }}>
                Logout
            </Button>: ""}
        </>
    );    
};

function Login(){
    const [localUsername, setLocalUsername] = useState("");
    const {setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags

    // login post
    function login_request(){
        axios.post("/admin/login", {'login_name': localUsername}).then(
            function(success){
                const user = success.data;
                //console.log(user);
                setUsername(user.login_name);
                setFirstname(user.first_name);
                setLastname(user.last_name);
                setUser_id(user._id);
                
                console.log("posted login");
            },
            (failure) => {console.log(failure);  }
            );
    }

    return(
        <>
            <Typography variant="h4" className="name">Login to Continue</Typography>
            <TextField required id="outlined-basic" label="Username" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalUsername(event.target.value)}} />
            <Button variant="contained" onClick={() => {login_request();}} sx={{ m: 2 }}>
                login
            </Button>
        </>
    );
}

export default Login;