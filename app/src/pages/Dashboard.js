import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { storageHandler } from '../components/localStorageHandler'
import NavBarHeader from '../components/NavBarHeader'
import Paitents from '../components/Paitents'
import { IP } from '../configs/configs'
import "../styles/Dashboard.css"

export default function Dashboard() {
    
    const localStorageHandler = new storageHandler()

    const navigate = useNavigate()
    const location = useLocation()

    const storage = localStorageHandler.getLocalStorage()

    const storedId = storage.id
    const storedToken = storage.token

    const [data , setData] = useState([])

    useEffect(()=>{
        console.log(location.state)
        if(location.state == null){
            localStorageHandler.clearLocalStorage()
            return navigate("/login",{replace:true})
        }   
        else{
            if(location.state.id != storedId || location.state.token != storedToken){
                localStorageHandler.clearLocalStorage()
                return navigate("/login",{replace:true})
            }
        }
        if(location.state.role === "Nurse"){

            getNursesPaitents()
        }
        if(location.state.role === "Doctor"){
            getDoctorsPaitents()
        
        }
        },[])
        
        async function getNursesPaitents(){
            await axios.get(`${IP}/get/paitents/nurse`,{
                params:{
                    nurse_id:location.state.id
                }
            })
            .then(async (response)=>{
                console.log(response.data)
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
                return response.data
            })
            .catch((err)=>console.log(err))
        }

    return(
        <>
            <div>
                {location.state == null ? <></> : <NavBarHeader role={location.state.role} person_id={location.state.id} />}
            </div>
            <Paitents data={data}/>
            
        </>
    )
}
