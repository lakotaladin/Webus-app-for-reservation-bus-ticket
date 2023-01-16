import React from 'react'
import ClockLoader from "react-spinners/ClockLoader";

function Loader() {
   return (
      <div className='spinnerglavni'>
         {/* <Spin size="large" style={{transform: 'scale(2)'}} /> */}
         <ClockLoader
            color="#ffffff"
            size={100}
         />
      </div>

   )
}

export default Loader