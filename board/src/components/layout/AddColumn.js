import React, { Component } from 'react';
import ServerRequest from '../App';



function AddColumnButton (props) {

    return (
    <div className="add-list">
        <div className="title editable" onClick={props.onClick}>+ Add another list</div>
    </div>
    )
}

export default AddColumnButton;