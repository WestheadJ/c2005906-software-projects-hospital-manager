import React, { useState } from 'react'
import { Card,Button } from 'react-bootstrap'
import "../styles/Register.css"
import {useNavigate} from "react-router-dom"

// import Login_Register_Error from './components/Login_Register_Error'

export default function Register() {
    const navigate = useNavigate();

    function Register(){
        navigate('/login');
    }

    const [forename,setForename] = useState();
    const [surname,setSurname] = useState();
    const [password,setPassword] = useState();
    const [email,setEmail] = useState();
    const [mobileNumber,setMobileNumber] = useState();
    const [confirmPassword,setConfirmPassword] = useState();

    return (
        <div style={{margin:"auto"}}>
            <Card id="registerContainer">
                <Card.Title style={{textAlign:"center",paddingTop:"5%"}}><h1>Register</h1></Card.Title>
                <hr/>
                <Card.Body style={{display:'flex',flexDirection:"column"}}>
                    
                    <label for="forename">Forename:</label>
                    <input type="text" name="forename" onChange={(e)=>{
                        setForename(e.target.value)
                    }}/>
                    
                    <label for="surname">Surname:</label>
                    <input name="surname" onChange={(e)=>{
                        setSurname(e.target.value)
                    }}/>
                    
                    <label for="email">Email Address: </label>
                    <input name="email" onChange={(e)=>{
                        setEmail(e.target.value)
                    }}/>

                    <label for="mobile">Mobile Number: </label>
                        <input name="mobile" onChange={(e)=>{
                            setMobileNumber(e.target.value)
                        }}/>

                    <label for="password">Password: </label>
                        <input name="password" onChange={(e)=>{
                            setPassword(e.target.value)
                        }}/>

                    <label for="confirmPassword">Confirm Password: </label>
                        <input name="confirmPassword" onChange={(e)=>{
                            setConfirmPassword(e.target.value)
                        }}/>
                    
                    <Button id="registerButton" onClick={()=>{
                        Register()
                    }}>Login</Button>
                </Card.Body>
            </Card>
        </div>
    )
}
