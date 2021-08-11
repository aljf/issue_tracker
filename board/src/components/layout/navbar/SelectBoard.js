import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputGroup } from 'react-bootstrap';
import serverRequest from '../../App';
const current_domain  = 'http://127.0.0.1:8000'


export default function SelectBoard(props) {
    const [show, setShow] = useState(false);
    const [boards, setBoards] = useState({'ids': [], 'names': []});
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};

    useEffect(() => {
        const myCallback = (response, status) => {
            if (status == 200) {
                let new_boards = boards;
                new_boards = response;
                return setBoards(new_boards);
            }
        }
        serverRequest(myCallback, "/select_board/", "GET")
      }, []);

    // TODO: find a way to update this everytime the modal opens
    // const GetBoards = () => {
    //     const myCallback = (response, status) => {
    //         console.log(response);
    //         if (status == 200) {
    //             let new_boards = boards;
    //             new_boards.push(response);
    //             // Force Modal to update
    //             return setBoards(new_boards);
    //         }
    //     }
    //     serverRequest(myCallback, "/select_board/", "GET")
        
    // }

    function RedirectBoard (boardID){   
        const lastUsedCallback = (response, status) => {
            if (status == 200) {
                console.log('last board changed!')
            }
        }
        serverRequest(lastUsedCallback, `/change_last_used_board/${boardID}/`, "POST")
        console.log(boardID)
        let new_board_url = current_domain + `/board/${boardID}/`
        window.location.href = new_board_url
    }

    return (
        <>
        <Button variant="primary" onClick={(e) => {handleShow(e);}} >
            Select Board
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Select Board</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                boards['ids'].map((board_id, i) => {
                return <InputGroup className="select-board" key={board_id} onClick={(board_id) => RedirectBoard(boards['ids'][i])}>
                <InputGroup.Prepend>
                    <InputGroup.Radio key={board_id} />
                </InputGroup.Prepend>
                <InputGroup.Text>{boards['names'][i]}</InputGroup.Text>
                </InputGroup>
                })}
            </Modal.Body>
        </Modal>
        </>
    );
}
