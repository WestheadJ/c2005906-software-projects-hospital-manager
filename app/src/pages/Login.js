import React, { useEffect, useState } from 'react'
import { Card, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import "../styles/Login.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"
import { v4 as uuid } from "uuid"
import { storageHandler } from '../components/localStorageHandler'
import { IP } from '../configs/configs'


export default function Login() {
    const localStorageHandler = new storageHandler()

    useEffect(() => {
        localStorageHandler.clearLocalStorage()
    })
    const navigate = useNavigate()

    const [role, setRole] = useState("None Selected")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false)

    async function Login(e) {
        e.preventDefault()

        if (role === "None Selected") { return setError("Please select a role first") }
        else {
            if (email === '' || password === "") { return setError("Either email or password have been left empty!") }
            else {
                await axios.get(`${IP}/login`, {
                    params:
                    {
                        "email": email,
                        "password": password,
                        "role": role
                    }
                })
                    .then((response) => {
                        if (response.data.state === true) {
                            const token = uuid()
                            const id = response.data.data
                            localStorageHandler.setLocalStorage(token, id)

                            navigate('/', { state: { token: token, id: id, role: role }, replace: true })
                        }
                        else {
                            return setError("Email or password or the role is incorrect")
                        }
                    })
            }
        }
    }

    return (
        <div style={{ margin: "auto" }}>
            <Card id="loginContainer">
                <Card.Title style={{ textAlign: "center", paddingTop: "5%" }}><h1>Login</h1></Card.Title>
                <hr />
                <Card.Body style={{ display: 'flex', flexDirection: "column" }}>

                    {error ? <><h4 id='error'>{error}</h4></> : <></>}

                    <label>Logging in as?</label>
                    <>
                        <DropdownButton title="Select Role">
                            <Dropdown.Item onClick={() => {
                                setRole("Nurse")
                            }}>Nurse</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setRole("Doctor")
                            }}>Doctor</Dropdown.Item>
                        </DropdownButton>
                        <h3>Selected Role:{role}</h3>
                    </>
                    <label for="email">Email:</label>
                    <input type="text" name="email" placeholder='example@example.com' onChange={(e) => {
                        setEmail(e.target.value)
                    }} />

                    {!passwordVisible ?
                        <>
                            <label for="password" name="password" onChange={(e) => setPassword(e.target.value)}>Password:     <BsEyeFill onClick={() => setPasswordVisible(true)} />
                            </label>
                            <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                        </> :
                        <>
                            <label for="password" name="password" onChange={(e) => setPassword(e.target.value)}>Password:    <BsEyeSlashFill onClick={() => setPasswordVisible(false)} />
                            </label>
                            <input type="text" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                        </>}
                    <Link to="/register" id='register-link'>Not registered? Register here.</Link>
                    <Button id="loginButton" onClick={Login}>Login</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
