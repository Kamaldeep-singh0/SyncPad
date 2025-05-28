import {userSchema} from '@syncpad/validation';
import axios from 'axios';
import { ChangeEvent, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {BACKEND_URL} from '../config'  /// not yet maded


function Auth({type}:{type:"signin"|"signup"}) {

    const navigate = useNavigate();
  const [postInput,setPostInput] = useState<typeof userSchema>({
       firstName: "",
       lastName: "",
       email: "",
       password: ""
       })

       async function sendRequest(){
          try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup"? "signup" : "signin" }`,postInput)
            const jwt = response.data.jwt;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
          } catch (error) {
            alert("Error while signing up")
            console.log(error)
          }
       }

  return (
    <div >
      <div className=' h-screen  flex flex-col justify-center '>
        <div className='  flex flex-col justify-center items-center  ' >
            <div className='px-10  flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-extrabold'>{type === "signup"? "Create an account" : "Login your account" }</h1>
            <h3 className='text-lg text-gray-600 my-3'> {type === "signup"? "Already have an account? " : "Don't have an account " }
                <Link to={type === "signup"? "/signin" : "/signup" } className='underline'>{type === "signup"? "Signin" : "Signup" }</Link></h3>
            </div>
            
            <div className=' w-3/6'>
            {type === "signup"? 
             <LabelledInput label="firstName" placeholder="JohnDoe" onChange={(e)=>{
                setPostInput({
                 ...postInput ,
                 firstName:e.target.value
                });
               
           }} /> : null }

           {type === "signup"? 
             <LabelledInput label="lastName" placeholder="Singh" onChange={(e)=>{
                setPostInput({
                 ...postInput ,
                 lastName:e.target.value
                });
               
           }} /> : null }
           

               <LabelledInput label="Email" placeholder="JohnDoe@gmail.com" onChange={(e)=>{
                 setPostInput({
                  ...postInput ,
                  email:e.target.value
                 })
            }} />

                <LabelledInput label="Password" placeholder="Secret" type="password" onChange={(e)=>{
                 setPostInput({
                  ...postInput ,
                  password:e.target.value
                 })
            }} />
               

            <button onClick={sendRequest} className='mt-8 w-full h-12 bg-black rounded-md text-white text-xl font-semibold focus:outline-none focus:ring-4 focus:ring-gray-300 '>
            {type === "signup"? "Sign Up" : "Login" }
            </button>
            </div>
        </div>
      </div>
     
    </div>
  )
}

interface LabelledInputType{
  label: string;
  placeholder:string;
  onChange:(e: ChangeEvent<HTMLInputElement>)=>void;
  type? : string;
}

function LabelledInput({label,placeholder,onChange,type}:LabelledInputType){
  return <div>
     <label className='block mb-2 text-xl text-black font-semibold pt-4'>{label}</label>
     <input  type={type || "text"} className='g-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' placeholder={placeholder} onChange={onChange}/>
  </div>
}

export default Auth