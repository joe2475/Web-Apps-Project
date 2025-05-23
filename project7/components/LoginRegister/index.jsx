import React, {useState} from "react";
import { Button, TextField, Typography} from "@mui/material";

import axios from "axios";
import useStateContext from "../Context";

// logout button
export function Logout(){
    const {username, setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags
    // logout post
    function logout_request(){
        axios.post("/admin/logout").then(
            function(){
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
        
           (username? <Button variant="contained" color="error" onClick={() => {logout_request();}} sx={{ m: 2 }}> Logout </Button>: "")
    );    
}


export function RegisterView({changeView}){
    const {setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags
    
    const [localUsername, setLocalUsername] = useState("");
    const [localFirstName, setLocalFirstName] = useState("");
    const [localLastName, setLocalLastName] = useState("");
    const [localPasswordA, setLocalPasswordA] = useState("");
    const [localPasswordB, setLocalPasswordB] = useState("");
    const [occupation, setLocalOccupation] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [localError, setLocalError] = useState("");

    // register post
    function register_request(){
        // validate elements
        if (localUsername.length === 0){
            setLocalError("Please enter a username.");
            return;
        }
        if (localPasswordA.length === 0){
            setLocalError("Invalid password length.");
            return;
        }
        if (localFirstName.length === 0 || localLastName.length === 0){
            setLocalError("Please enter a first and last name.");
            return;
        }
        // validate password
        if (localPasswordA === localPasswordB){
            axios.post("/user", 
                {login_name: localUsername, 
                    password: localPasswordA,
                    first_name: localFirstName,
                    last_name: localLastName,
                    occupation: occupation,
                    description: description,
                    location: location,
                }).then(
                function(success){
                    const user = success.data;
                    //console.log(user);
                    setUsername(user.login_name);
                    setFirstname(user.first_name);
                    setLastname(user.last_name);
                    setUser_id(user._id);
                    
                    console.log("posted login");
                },
                (failure) => {
                    console.log(failure);  
                    setLocalError("Login error: Invalid credentials.");
                }
            );
        }
        else{
            setLocalError("Invalid password.");
        }
    }

    return(
        <>
            <Typography variant="h4" className="name">Register New User</Typography>
            <TextField required label="Username" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalUsername(event.target.value);}} />
            <TextField required label="First Name" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalFirstName(event.target.value);}} />
            <TextField required label="Last Name" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalLastName(event.target.value);}} />
            <TextField required type="password" label="Password" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalPasswordA(event.target.value);}} />
            <TextField required type="password" label="Re-enter Password" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalPasswordB(event.target.value);}} />
            
            <TextField required label="Location" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocation(event.target.value);}} />
            <TextField required label="Occupation" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalOccupation(event.target.value);}} />
            <TextField required label="Description" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setDescription(event.target.value);}} />
            <Button variant="contained" onClick={() => {register_request();}} sx={{ m: 2 }}>
                Register Me
            </Button>
            <Button variant="contained" onClick={() => {changeView(true);}} sx={{ m: 2 }}>
                Returning user
            </Button>
            <Typography variant="h4" className="name" color="error">{localError}</Typography>
        </>
    );

    // return(
    //     <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
    //       <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
    //       <Input
    //         id="standard-adornment-password"
    //         type={showPassword ? 'text' : 'password'}
    //         endAdornment={
    //           <InputAdornment position="end">
    //             <IconButton
    //               aria-label={
    //                 showPassword ? 'hide the password' : 'display the password'
    //               }
    //               onClick={handleClickShowPassword}
    //               onMouseDown={handleMouseDownPassword}
    //               onMouseUp={handleMouseUpPassword}
    //             >
    //               {showPassword ? <VisibilityOff /> : <Visibility />}
    //             </IconButton>
    //           </InputAdornment>
    //         }
    //       />
    //     </FormControl>
    // );    
}

function LoginView({changeView}){
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const {setUsername, setFirstname, setLastname, setUser_id} = useStateContext(); // get flags

    // login post
    function login_request(){
        axios.post("/admin/login", {login_name: localUsername, password: localPassword}).then(
            function(success){
                const user = success.data;
                //console.log(user);
                setUsername(user.login_name);
                setFirstname(user.first_name);
                setLastname(user.last_name);
                setUser_id(user._id);
                
                console.log("posted login");
            },
            (failure) => {
                console.log(failure);  
                setLocalError("Login error: Invalid credentials.");
            }
        );
    }

    return(
        <>
            <Typography variant="h4" className="name">Login to Continue</Typography>
            <TextField required id="outlined-required" label="Username" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalUsername(event.target.value);}} />
            <TextField required id="outlined-password-input" type="password" label="Password" variant="outlined" sx={{ m: 2 }}
            onChange={(event) => {setLocalPassword(event.target.value);}} />
            <Button variant="contained" onClick={() => {login_request();}} sx={{ m: 2 }}>
                login
            </Button>
            <Button variant="contained" onClick={() => {changeView(false);}} sx={{ m: 2 }}>
                Register new user
            </Button>
            <Typography variant="h4" className="name" color="error">{localError}</Typography>
        </>
    );
}

function LoginRegister(){
    const [useLogin, setUseLogin] = useState(true);
    return(
        
            (useLogin? <LoginView changeView={setUseLogin} /> : <RegisterView changeView={setUseLogin} />)
        
    );
}

export default LoginRegister;