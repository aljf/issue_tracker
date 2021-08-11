import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import ServerRequest from '../../App';
import { FormControl } from 'react-bootstrap';


export default function NewBoard(props) {
    const [show, setShow] = useState(false);
    const boardID = props.boardID;
    let NewBoardName = ''

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const createNewBoard = () => {
        const myCallback = (response, status) => {
            if (status == 200) {
                // redirect the page
                console.log('working');
                window.location.href = `http://127.0.0.1:8000/board` + response['redirect_url'];
            }
        }
        NewBoardName = document.getElementById('new-board-name').value
        if (NewBoardName) {
            ServerRequest(myCallback, `/${boardID}/`, "POST", {name: NewBoardName, process: 'createBoard'})
        } else{
            alert('Board Name Required')
        }
    }


    return (
        <>
        <div>
            <Button className="nav-item" variant="outline-dark" onClick={handleShow} >
                <i className="fa fa-plus icon-margin" aria-hidden="true"></i>
                New Board
            </Button>
            
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>New Board Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                <FormControl 
                    id="new-board-name"
                    placeholder="Board Name"
                    aria-label="Board Name"/> 
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={createNewBoard}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}