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
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  contact_phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  location: yup.string(),
  urgency: yup
    .string()
    .oneOf(["ok", "no data"], "Status must be 'ok' or 'no data'"),
});

const urgencyOptions = [
  { value: "ok", label: "OK" },
  { value: "no data", label: "No data" },
];

function AddSeekerDialog({ onAddSeeker }) {
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const AddSeeker = async (data) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/requests/", data);
      console.log("Seeker added!");
      setIsAdding(true);
      reset();
      if (onAddSeeker) onAddSeeker();
      setOpen(false);
    } catch (err) {
      console.error("Error details:", JSON.stringify(err.response?.data));
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isAdding && (
        <DialogTrigger asChild>
          Add Seeker
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Seeker</DialogTitle>
          <DialogDescription>
            Please fill in the details to add a new seeker.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Title" {...register("title")} />
            {errors.title && (
              <b style={{ color: "red" }}>{errors.title.message}</b>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Description"
              {...register("description")}
            />
            {errors.description && (
              <b style={{ color: "red" }}>{errors.description.message}</b>
            )}
          </div>

          <div>
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              placeholder="Phone"
              {...register("contact_phone")}
            />
            {errors.contact_phone && (
              <b style={{ color: "red" }}>{errors.contact_phone.message}</b>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Location"
              {...register("location")}
            />
            {errors.location && (
              <b style={{ color: "red" }}>{errors.location.message}</b>
            )}
          </div>

          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <select
              id="urgency"
              {...register("urgency")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select urgency</option>
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.urgency && (
              <b style={{ color: "red" }}>{errors.urgency.message}</b>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(AddSeeker)}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddSeekerDialog;
