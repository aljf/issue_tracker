import React, { useRef, useEffect } from 'react';
import ServerRequest from '../App';

function RemoveListButton(props) {
    let listID = props.listID;
    const mountedRef = useRef(true);

    const removeList = () => {
        const myCallback = (response, status) => {
			if (status == 200) {
                // props.refreshBoard();
                location.reload();
			}
        }
		ServerRequest(myCallback, `/delete_column/`, "POST", {id: listID})  
    }

    useEffect(() => {
        return () => { 
          mountedRef.current = false
        }
    }, [])

    return (
        <div onClick={removeList} className="remove-list-button"><i className="fas fa-trash"></i></div>
    )
}

export default RemoveListButton;