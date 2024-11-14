"use strict";

import React, {createContext, useState, useContext} from "react";

// state provider
const StateProvider = createContext(null);

// provide context
export function Context({children}){
    // states tracked by context
    const [useAdvanced, setUseAdvanced] = useState(false);  // tracks whether advanced state is used
    const [username, setUsername] = useState(undefined); // tracks username of a given session

    return (
        <StateProvider.Provider value={{
            useAdvanced, setUseAdvanced, username, setUsername
            }}>
            {children}
        </StateProvider.Provider>
    )
}

export default function useStateContext(){return useContext(StateProvider)};