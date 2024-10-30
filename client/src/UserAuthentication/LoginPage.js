import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Utilities/Button';
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const relocate = useNavigate();

    const submit = async () => {
        try {
            const response = await fetch("http://localhost:3001/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const res = JSON.parse(await response.json());
            if (res.message === "User authenticated successfully") {
                relocate("/home", { state: res.user });
            }
            else {
                alert(res.message);
            }
        }
        catch (e) {
            alert(`Error: ${e}`);
        }
    }
return (
    <div className='flex flex-col border-2 rounded-md bg-slate-600 opacity-70 h-fit w-fit align-center'>
        <div className='flex flex-col self-center p-4 gap-2 items-center'>
            <h1 className='text-4xl'>Login</h1>
            <div>
                <div className='text-xl text-semibold'>Email</div>
                <input className='p-1 rounded-md outline-0' type = "email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <div className='text-xl text-semibold'>Password</div>
                <input className='p-1 rounded-md outline-0' type = "password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
                <Button type="submit" data="Login" click={submit}/>
            </div>   
            <div>
                <div className='text-blue-300 hover:text-blue-500'><Link to="/signup">Dont have an account?</Link></div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage