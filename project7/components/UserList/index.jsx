"use strict";

import React, {useState} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./styles.css";
import axios from "axios";

// user list component
function UserList({flags}) {
  // user model
  const [model, setModel] = useState({});

  // fetch data; when flag enabled, use a different api
  if(flags && flags.flag){
    axios.get("/user-exp/list").then(
      function(success){setModel(success.data); },
      (failure) => {console.log(failure);  }
    );
  }
  else{
    axios.get("/user/list").then(
      function(success){setModel(success.data); },
      (failure) => {console.log(failure);  }
    );
  }

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
                {flags.flag? <a href={"#photos/"+item._id} className="linkButton dot">{item.pic_count}</a>:""}
                {flags.flag? <a href={"#comments/"+item._id} className="linkButton dot red">{item.comment_count}</a>               
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
