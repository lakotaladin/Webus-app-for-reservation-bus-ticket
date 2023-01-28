import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { SetUser } from "../redux/userSlice";
import '../resources/profile.css';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function Profile() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  // ref na formu
  const [form] = Form.useForm();


  // Logika za dohvaćanje korisnika i ispisivanje u inputima njegovih podataka
  useEffect(() => {
    const dohvati = async () => {

      dispatch(ShowLoading());
      const result = await axios.post(
        "/api/users/get-user-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },

      );
      // console.log('user', result.data.data)
      setUser(result.data.data);
      form.setFieldsValue({
        ime: result.data.data.ime,
        email: result.data.data.email
      });
      dispatch(HideLoading());
    }
    if (localStorage.getItem("token")) {
      dohvati();
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch, form]);

  async function onFinish(userData) {
    // console.log(userData);
    dispatch(ShowLoading());
    try {
      const response = await axios.put(
        "/api/users/update-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },

      );
      // console.log(response.data)
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
        message.success("Uspešno ste izmenili lične podatke");
        navigate('/');
      }
    } catch (error) {
      message.error("Nešto nije u redu", error.message);
    }

    dispatch(HideLoading());
  }

  async function onPasswordFinish(passwordData) {
    dispatch(ShowLoading());
    try {
      await axios.put(
        "/api/users/update-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },

      );
      message.success('Uspešno ste promenili lozinku');
      navigate('/');
    } catch (error) {
      message.error("Nešto nije u redu", error.message);
    }

    dispatch(HideLoading());
  }

  return (
    <>
      <div key={user._id} className='profileglavni d-flex flex-column w-100'>
        <Form
          className="forma1"
          form={form}
          initialValues={user}
          onFinish={onFinish}
          layout="vertical"
        >

          <h3 className="card-title mb-3">Informacije korisnika</h3>


          <Form.Item
            rules={[{ required: true, message: 'Molimo Vas, upišite ime!' }, { min: 3, message: "Ime mora sadržati 3 ili više karaktera" }, { max: 64, message: "Ime mora sadržati najvise 64 slova" },]}
            label="Ime:"
            name="ime"
          >
            <Input className="w-100" prefix={<UserOutlined className="site-form-item-icon" />} type="text" />
          </Form.Item>


          <Form.Item
            rules={[{ required: true, message: 'Molimo Vas, upišite email!' }]}
            label="Email:"
            name="email"
          >
            <Input className="w-100" type="email" prefix={<MailOutlined className="site-form-item-icon" />} />
          </Form.Item>





          <Button title="Izmeni podatke" className="dugmejedan  rounded" htmlType="submit">
            Izmeni
          </Button>

        </Form>




        <Form
          className="forma2"
          onFinish={onPasswordFinish}
          layout="vertical"
        >


          <hr className="mt-5 mb-5" />
          <h3 className="card-title m-3">Promena lozinke</h3>

          <Form.Item
            rules={[
              { required: true, message: 'Molimo Vas, upišite lozinku!' },
              { min: 8, message: "Lozinka mora sadržati 8 ili više karaktera" },
              { max: 64, message: "Lozinka mora sadržati najvise 64 karaktera" },
            ]}
            label="Nova lozinka:"
            name="password"
          >
            <Input.Password className="w-100" type="password" placeholder="Nova lozinka" />
          </Form.Item>


          <Form.Item
            rules={[
              { required: true, message: 'Molimo Vas, upišite lozinku!' },
              { min: 8, message: "Lozinka mora sadržati 8 ili više karaktera" },
              { max: 64, message: "Lozinka mora sadržati najvise 64 karaktera" },
            ]}
            label="Potvrdi lozinku:"
          >
            <Input.Password className="w-100" type="password" placeholder="Potvrdi" />
          </Form.Item>




          <Button title="Izmeni lozinku" className="dugmedva  rounded" htmlType="submit">
            Promeni lozinku
          </Button>

        </Form>
      </div>
    </>
  )
}


export default Profile