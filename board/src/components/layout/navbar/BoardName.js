import React, { Component } from 'react';
import ServerRequest from '../../App';


const BoardName = (props) => {

        const EditBoardName = (event) => {
            const myCallback = (response, status) => {
                if (status == 200) {
                    console.log('Board Name Changed!')
                }
            }
            ServerRequest(myCallback, `/${props.boardID}/edit_board_name`, "POST", {'name': event.currentTarget.textContent, 'board_id': props.boardID})
        }

        const handleEnter = (event) => {    
            if (event.key === 'Enter' && event.currentTarget.textContent != props.name) {
                event.preventDefault();
                EditBoardName(event);
            }
        }
        return (
            <div>
                <span id="boardName" contentEditable="true" onKeyDown={handleEnter}>{props.name}</span>
            </div>
        )
}

export default BoardName;