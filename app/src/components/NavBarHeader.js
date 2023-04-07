import React from 'react'
import { Container, Navbar, Nav } from "react-bootstrap"
import "../styles/NavBarHeader.css"
import { useNavigate } from "react-router-dom"

export default function NavBarHeader({ role, person_id }) {
    const navigate = useNavigate();

    function logout() {
        navigate('/login')
    }

    return (
        <Navbar style={{ backgroundColor: "#3D5A80" }} id='#navbar-header' expand="lg">
            <Container>
                <h3><span style={{ color: '#EE6C4D' }}>{role}</span> : {person_id}</h3>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav >
                        <Nav.Link onClick={(e) => {
                            e.preventDefault()
                            navigate('/')
                        }} className='navbar-item'>Dashboard</Nav.Link>
                        <Nav.Link className='navbar-item' onClick={(e) => {
                            e.preventDefault()
                            logout()
                        }}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
