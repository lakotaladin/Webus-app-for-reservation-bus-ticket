import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Form, Input, message } from "antd";
import '../resources/auth.css'



function ResetPassword() {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [confirmpassword, setConfirmPassword] = useState("");
  const params = useParams();
  const navigate = useNavigate();



  const resetPassword = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/reset-password", {
        password,
        token: params.token,
      });
      if (response.data.success) {
        message.success("Lozinka je uspešno promenjena", response.data.message);
        navigate("/login");
      } else {
        message.error("Istekao ili nevalidan token!");
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error("Nešto nije u redu");
    }
  };

  return (
    <>
      <div id="pozadina" className='forma d-flex  justify-content-center align-items-center auth'>
        <div className="odforme card bg-light p-3">

          <h1 className="text-lg">
            WEBUS - RESTARTOVANJE LOZINKE
          </h1>

          <hr />
          <Form layout='vertical'>
            <Form.Item
              label="Vaša nova lozinka:"
              name="password"
              rules={[
                { required: true, message: 'Molimo Vas, upišite lozinku!' },
                { min: 8, message: "Lozinka mora sadržati 8 ili više karaktera" },
                { max: 64, message: "Lozinka mora sadržati najvise 64 karaktera" },
              ]}
            >
              <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Nova lozinka" />
            </Form.Item>
            <Form.Item
              label="Potvrdite lozinku:"
              name="confirmpassword"
              rules={[
                { required: true, message: 'Molimo Vas, upišite lozinku!' },
                { min: 8, message: "Lozinka mora sadržati 8 ili više karaktera" },
                { max: 64, message: "Lozinka mora sadržati najvise 64 karaktera" },
              ]}
            >
              <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmpassword} placeholder="Potvrdite lozinku" />
            </Form.Item>
            <div className="flex flex-col justify-between items-end">
              <button
                title="Resetuj lozinku"
                className="dugme mt-3 mb-2 w-100"
                onClick={resetPassword}
              >
                RESETUJ
              </button>

              <hr />
              <Link title="Vratite se na logovanje" to="/login"
                 className="vratise d-flex flex-column  cursor-pointer"
              >
                <i  className="ri-arrow-left-circle-line"></i>
                Vratite se na logovanje
              </Link>

            </div>
          </Form>
        </div>
      </div>
    </>

  );

}

export default ResetPassword;
