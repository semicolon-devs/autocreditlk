import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ProtectedRoute = ({children}) => {

    const token = cookies.get('autoCreditCookie');

    if(!token) {
        return <Navigate to='/sign-in' />
    }
    return children;

}

export default ProtectedRoute