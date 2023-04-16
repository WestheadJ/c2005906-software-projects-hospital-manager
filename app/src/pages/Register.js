import React, { useState } from 'react'
import { Card, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import "../styles/Register.css"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { IP } from '../configs/configs';
import "../styles/Register.css"

// import Login_Register_Error from './components/Login_Register_Error'

export default function Register() {
    const navigate = useNavigate();

    const [forename, setForename] = useState();
    const [surname, setSurname] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [role, setRole] = useState("")
    const [hospitalCode, setHospitalCode] = useState()
    const [error, setError] = useState()

    async function Register() {
        if (role !== "") {
            await axios.post(`${IP}/register`,
                {
                    forename: forename,
                    surname: surname,
                    password: password,
                    email: email,
                    mobileNumber: mobileNumber,
                    hospitalCode: hospitalCode,
                    role: role
                }
            ).then((res) => {
                console.log(res)
                if (res.data === true) {
                    navigate("/login", { replace: true })
                }
                else {
                    setError("Something went wrong try again")
                }
            })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            setError("A role needs to be chosen")
        }

    }

    function checkPasswords() {
        if (password === confirmPassword) {
            setError()
        }
        else {
            setError("Passwords don't match")
        }
    }

    return (
        <div style={{ margin: "auto" }}>
            <Card id="registerContainer">
                <Card.Title style={{ textAlign: "center", paddingTop: "5%" }}><h1>Register</h1></Card.Title>
                <hr />
                <Card.Body style={{ display: 'flex', flexDirection: "column" }}>

                    {error ? <><h4 id='error'>{error}</h4></> : <></>}

                    <DropdownButton title="Select Role">
                        <Dropdown.Item onClick={() => {
                            setRole("Nurse")
                        }}>Nurse</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setRole("Doctor")
                        }}>Doctor</Dropdown.Item>
                    </DropdownButton>
                    <h3>Selected Role:{role}</h3>
                    <label for="forename">Forename:</label>
                    <input type="text" name="forename" onChange={(e) => {
                        setForename(e.target.value)
                    }} />

                    <label for="surname">Surname:</label>
                    <input name="surname" onChange={(e) => {
                        setSurname(e.target.value)
                    }} />

                    <label for="email">Email Address: </label>
                    <input name="email" onChange={(e) => {
                        setEmail(e.target.value)
                    }} />

                    <label for="mobile">Mobile Number: </label>
                    <input name="mobile" onChange={(e) => {
                        setMobileNumber(e.target.value)
                    }} />

                    <label for="password">Password: </label>
                    <input name="password" onChange={(e) => {
                        setPassword(e.target.value)
                    }} />

                    <label for="confirmPassword">Confirm Password: </label>
                    <input name="confirmPassword" onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        checkPasswords()
                    }} />

                    <label for="hospitalCode">Hospital Code:</label>
                    <input name="hospitalCode" onChange={(e) => {
                        setHospitalCode(e.target.value)
                    }} />

                    <Button id="registerButton" onClick={() => {
                        Register()
                    }}>Login</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
