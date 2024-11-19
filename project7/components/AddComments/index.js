import React from "react";
import { Button } from "@mui/material";
function AddComment({photoId})
{
    return ( <>
    <Button variant="contained">Add Comment</Button>
    <p>Test {photoId}</p>
    </>
    )
}

export default AddComment;