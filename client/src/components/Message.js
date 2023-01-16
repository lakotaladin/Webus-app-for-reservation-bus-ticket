import React from 'react';
import { notification } from 'antd';



const Message = () => {
  const [api, contextHolder] = notification.useNotification();
 
  const openNotification = () => {
    api.open({
      message: 'Informacije',
      description:
        'Ukoliko ne možete da se ulogujete na našu veb aplikaciju, molimo Vas, pišite nam na našem oficijalnom mejlu webus.official2022@gmail.com',
      duration: 14,
    });
  };


  return (
    <>
      {contextHolder}
      <button id='infodugme' onClick={openNotification}>
      <i className="ri-information-line"></i>
      </button>
    </>
  );
};
export default Message;