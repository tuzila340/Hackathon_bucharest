import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  seeker_firstname: yup.string().required("Firstname is required"),
  seeker_secondname: yup.string().required("Secondname is required"),
  seeker_phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  seeker_city: yup.string(),
  seeker_status: yup
    .string()
    .oneOf(["ok", "no data"], "Status must be 'active' or 'inactive'"),
});

const statuses = [
  { value: "ok", label: "OK" },
  { value: "no data", label: "No data" },
];

function AddSeekerDialog({ onAddSeeker }) {
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const AddSeeker = async (data) => {
    try {
      await axios.post("/api/requests/", data);
      console.log("Seeker added!");
      setIsAdding(true);

      reset();
      if (onAddSeeker) onAddSeeker();
      window.location.reload();
    } catch (err) {
      console.error("Error details:", JSON.stringify(err.response?.data));
      setIsAdding(false);
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isAdding && <DialogTrigger asChild>Add Seeker</DialogTrigger>}

        <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Seeker</DialogTitle>
          <DialogDescription>
            Please fill in the details to add a new seeker.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="firstname">Firstname</Label>
            <Input
              id="firstname"
              placeholder="Firstname"
              {...register("seeker_firstname")}
            />
            {errors.seeker_firstname && <b style={{ color: "red" }}>{errors.seeker_firstname.message}</b>}
          </div>

          <div>
            <Label htmlFor="secondname">Secondname</Label>
            <Input
              id="secondname"
              placeholder="Secondname"
              {...register("seeker_secondname")} ы
            />
            {errors.seeker_secondname && <b style={{ color: "red" }}>{errors.seeker_secondname.message}</b>}
          </div>

          <div>
            <Label htmlFor="role">Status</Label>
            <select
              id="role"
              {...register("seeker_status")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a status</option>
              {statuses.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.seeker_status && <b style={{ color: "red" }}>{errors.seeker_status.message}</b>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone" {...register("seeker_phone")} />
            {errors.seeker_phone && <b style={{ color: "red" }}>{errors.seeker_phone.message}</b>}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" {...register("seeker_city")} />
            {errors.seeker_city && <b style={{ color: "red" }}>{errors.seeker_city.message}</b>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit(AddSeeker)}>Submit</Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSeekerDialog;
