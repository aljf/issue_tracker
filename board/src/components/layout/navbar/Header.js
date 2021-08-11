import React from 'react';

import NewBoard from './NewBoard'
import SelectBoard from './SelectBoard';
import BoardName from './BoardName';
// import serverRequest from '../../App';
import ProfileDropDown from './ProfileDropDown';

function Header (props) {

    return (
        <div className="navbar">
            <SelectBoard />
            <BoardName name={props.boardName} boardID={props.boardID} />
            <div class="flex">
                <NewBoard boardID={props.boardID} />
                <ProfileDropDown username={props.username}/>
            </div>
        </div>
    );
}

export default Header;