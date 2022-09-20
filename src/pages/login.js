import React from "react";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    let config = {
      method: "post",
      url: "https://902c-103-240-204-216.in.ngrok.io/api/v1/user-app/create",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "OPTIONS",
          "PATCH",
        ],
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Credentials": true,
      },
      data,
    };
    localStorage.setItem("email", data.email);
    localStorage.setItem("type", data.type);

    let dataResponse = await axios(config);
    console.log("dataResponse", dataResponse);

    navigate("/otp");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="name" {...register("name", { required: true })} />

      <input {...register("email", { required: true })} placeholder="email" />
      <input
        {...register("mobileNumber", { required: true })}
        placeholder="mobileNumber"
      />
      <select {...register("type")}>
        <option value="CUSTOMER">CUSTOMER</option>
        <option value="DR">DR</option>
      </select>
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
};
