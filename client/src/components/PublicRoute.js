import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const {user} = useSelector(state => state.users);
   useEffect(() => {
     if (localStorage.getItem('token') && !user?.isVerifyed) {
       navigate('/');
     }
   }, [])

  return (
    <div>
      {children}
    </div>
  )
}

export default PublicRoute