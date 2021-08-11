import React, { Component } from 'react';
// import Button from 'react-bootstrap/Button';
import ServerRequest from '../../App';
import Dropdown from 'react-bootstrap/Dropdown'

const ProfileDropDown = (props) => {
    const username = props.username;

    const handleLogOut = () => {
        const myCallback = (response, status) => {
            console.log(response)
            console.log(status)
        }
        let url = ServerRequest(myCallback, ``, "POST", null, true)
        window.location.href = url
    }
    
    return (
        <>
        <Dropdown>
            <Dropdown.Toggle className="nav-item profile-btn" variant="outline-dark" >
                <i class="fas fa-user-circle"></i> Hi, {username}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        {/* <Button className="nav-item profile-btn" variant="link" onClick={handleLogOut}>
        <i class="fas fa-user-circle"></i> Logout
        </Button> */}
        </>
    )
}

export default ProfileDropDown;