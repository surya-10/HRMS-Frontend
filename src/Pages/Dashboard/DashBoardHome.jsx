import React from 'react'
import { useLocation } from 'react-router-dom';

const DashBoardHome = () => {
    let location = useLocation();
    console.log(location.state);
  return (
    <div>
        
    </div>
  )
}

export default DashBoardHome;