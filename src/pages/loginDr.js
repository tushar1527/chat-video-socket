import axios from "axios";
import jwtDecode from "jwt-decode";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
export const LoginDr = () => {
  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    let config = {
      method: "post",
      url: "https://1e43-2401-4900-1f3e-5929-bd15-a6ad-e7ab-488c.in.ngrok.io/api/v1/user-app/verify-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...data,
        email: localStorage.getItem("email"),
      },
    };

    let response = await axios(config);
    if (response) {
      console.log("response.data.data", response.data);
      let token = jwtDecode(response.data.token);
      localStorage.setItem("userId", token.sub);
      localStorage.setItem("token", response.data.token);
      navigate("/chat/create");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="otp" {...register("otp", { required: true })} />

      <input type="submit" />
    </form>
  );
};
