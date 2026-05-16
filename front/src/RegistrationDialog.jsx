import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import * as yup from "yup";
  import { useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { useState } from "react";
  import axios from "axios";
  
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    firstname: yup.string().required("Firstname is required"),
    secondname: yup.string().required("Secondname is required"),
    password: yup.string().required("Password is required"),
    phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits"),
    city: yup.string(),
  });
  
  function RegistrationDialog({ onRegister }) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [open, setOpen] = useState(false);
  
    const LogIn = async (data) => {
        try {
            await axios.post("http://localhost:5158/register", data);
              console.log("Registered!");
      
              await axios.post("http://localhost:5158/login", {
                  username: data.username,
                  password: data.password
              }, { withCredentials: true });
              console.log("Logged in!");
              setIsRegistered(true);
      
              reset();
              if (onRegister) onRegister();
              window.location.reload();
          } catch (err) {
            console.error("Error details:", JSON.stringify(err.response?.data));
              setIsRegistered(false);
          }
    };
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {!isRegistered && <DialogTrigger asChild>Registeration</DialogTrigger>}
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registeration</DialogTitle>
          </DialogHeader>
  
          <div className="flex flex-col gap-3">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                {...register("username")}
              />
              {errors.username && (
                <b style={{ color: "red" }}>{errors.username.message}</b>
              )}
            </div>
  
            <div>
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                placeholder="Firstname"
                {...register("firstname")}
              />
              {errors.firstname && (
                <b style={{ color: "red" }}>{errors.firstname.message}</b>
              )}
            </div>
  
            <div>
              <Label htmlFor="secondname">Secondname</Label>
              <Input
                id="secondname"
                placeholder="Secondname"
                {...register("secondname")}
              />
              {errors.secondname && (
                <b style={{ color: "red" }}>{errors.secondname.message}</b>
              )}
            </div>
  
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <b style={{ color: "red" }}>{errors.password.message}</b>
              )}
            </div>
  
  
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register("city")} />
              {errors.city && (
                <b style={{ color: "red" }}>{errors.city.message}</b>
              )}
            </div>
          </div>
  
          <DialogFooter>
            <Button onClick={handleSubmit(LogIn)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default RegistrationDialog;
  