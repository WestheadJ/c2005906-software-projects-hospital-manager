import React, { useState } from 'react'
import { Card,Button } from 'react-bootstrap'
import "../styles/Login.css"
import {Link, useNavigate} from "react-router-dom"

// import Login_Register_Error from './components/Login_Register_Error'

export default function Login() {
    const navigate = useNavigate();

    function Login(){
        navigate('/')
        console.log(email,password)
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
