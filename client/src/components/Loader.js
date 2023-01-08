import React from 'react'
import { Spin } from 'antd';

function Loader() {
    return (
 <div className='spinner-parent'>
    <Spin size="large" style={{transform: 'scale(2)'}} />
 </div>
        
    )
}

export default Loader