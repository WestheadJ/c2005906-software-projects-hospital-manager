import React, { useState } from 'react'
import { Card,Button } from 'react-bootstrap'
import "../styles/Login.css"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"

// import Login_Register_Error from './components/Login_Register_Error'

const IP = "http://10.90.11.121:3001/test"

export default function Login() {
    const navigate = useNavigate();

    async function Login(){
        await axios.get(`${IP}:3001/test`)
        .then((response)=>{
            console.log(response)
        })
    }

    const [email,setEmail] = useState()
    const [password,setPassword] = useState()

    return (
        <div style={{margin:"auto"}}>
            <Card id="loginContainer">
                <Card.Title style={{textAlign:"center",paddingTop:"5%"}}><h1>Login</h1></Card.Title>
                <hr/>
                <Card.Body style={{display:'flex',flexDirection:"column"}}>
                    <label for="email">Email:</label>
                    <input type="text" name="email" onChange={(e)=>{
                        setEmail(e.target.value)
                    }}/>
                    <label for="password" name="password" onChange={(e)=>{
                        setPassword(e.target.value)
                    }}>Password</label>
                    <input onChange={(e)=>{
                        setPassword(e.target.value)
                    }}/>
                    <Link to="/register" id='register-link'>Not registered? Register here.</Link>
                    <Button id="loginButton" onClick={()=>{
                        Login()
                    }}>Login</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
