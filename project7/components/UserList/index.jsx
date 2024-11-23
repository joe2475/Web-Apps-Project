import React, {useState, useEffect} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./styles.css";
import axios from "axios";
import useStateContext from "../Context";

axios.defaults.withCredentials = true;

// user list component
function UserList() {
  // user model
  const [model, setModel] = useState({});
  
  const {useAdvanced, username} = useStateContext(); // get flags

  // fetch data; when flag enabled, use a different api
  useEffect(()=>{
    if(useAdvanced){
      axios.get("/user-exp/list").then(
        function(success){setModel(success.data); },
        (failure) => {
          console.log(failure);  
          setModel({});
        }
      );
    }
    else{
      axios.get("/user/list").then(
        function(success){setModel(success.data); },
        (failure) => {
          console.log(failure);  
          setModel({});
        }
      );
    }
  },[useAdvanced, username]);

  // content display
  return (
    <div>
      <List>
        {model.length ? model.map( (item, key) => {
          return (
            <div key={key}>
              <ListItem>
                <ListItemText className="userListItem"
                primary={<a href={"#users/" + item._id}>{item.first_name + " " + item.last_name}</a>}
              />
                {/* Photo and comment buttons added when flag used */}
                {useAdvanced? <a href={"#photos/"+item._id} className="linkButton dot">{item.pic_count}</a>:""}
                {useAdvanced? <a href={"#comments/"+item._id} className="linkButton dot red">{item.comment_count}</a>               
                :""} 
              </ListItem>
              {key < model.length - 1 ? <Divider/> : null}
            </div>
          );
        }) : "No Data."}
      </List>
    </div>
  );
}

export default UserList;
