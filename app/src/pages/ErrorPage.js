import React from 'react'
import { Container,Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
    return (
        <>
            <Link to="/"><Button>Back</Button></Link>
            <div id='errorContainer'>
                <Container style={{textAlign:"center",paddingTop:"40vh"}}>
                        <h3>Oh no! There seems to be something wrong!</h3>
                        <p>The page you just put in doesn't exist either in the first place or now!</p>
                </Container>
            </div>
        </>
    )
}
