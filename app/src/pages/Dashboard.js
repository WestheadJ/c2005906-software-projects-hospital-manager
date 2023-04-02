import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Paitents from '../components/Paitents'
import { IP } from '../configs/configs'
import "../styles/Dashboard.css"
import Authenticator from '../components/authenticator'

export default function Dashboard() {

    const navigate = useNavigate()
    const location = useLocation()

    const [data , setData] = useState([])

    useEffect(()=>{
        try{if(location.state.role === "Nurse"){

            getNursesPaitents()
        }
        if(location.state.role === "Doctor"){
            getDoctorsPaitents()
        
        }}
        catch{
            return navigate("/login",{replace:true})

        }
        },[])
        
        async function getNursesPaitents(){
            await axios.get(`${IP}/get/paitents/nurse`,{
                params:{
                    nurse_id:location.state.id
                }
            })
            .then(async (response)=>{
                setData(response.data)
                // setLoading(true)
                console.log(data)
                
            })
            .catch(err=>{
                console.log(err)
                // setLoading(false)
            })
        }

        async function getDoctorsPaitents(){
            await axios.get(`${IP}/get/paitents/doctor`,{
                params:{
                    doctor_id:location.state.id
                }
            })
            .then((response)=>{
                console.log(response.data)
                return setData(response.data)
            })
            .catch((err)=>console.log(err))
        }

    return(
        <>
            <Authenticator />
            <div>
                {location.state == null ? <></> : <NavBarHeader role={location.state.role} person_id={location.state.id} />}
            </div>

            <Paitents data={data} role={location.state.role}/>
            
        </>
    )
}
