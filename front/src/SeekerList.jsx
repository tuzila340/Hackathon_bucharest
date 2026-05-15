import axios from "axios";
import { useState, useEffect } from "react";


function SeekerList() {
    const [seekers, setSeekers] = useState([]);

    const fetchSeekers = async () => {
        try {
            const response = await axios.get("http://localhost:5158/profile", {
              withCredentials: true,
            });
      
            console.log("Profile data:", response.data);
            setSeekers(response.data);
          } catch (err) {
            if (err.response?.status === 401) {
                setSeekers(null);
            } else {
              console.error("Error fetching profile:", err.message);
            }
          }
    };

    useEffect(() => {
        fetchSeekers();
    }, []);

    const displaySeekers = seekers?.firstname ?? "No seekers found";
 
   return (
    <>
        <h1>Seeker List</h1>
        <p>{displaySeekers}</p>

    </>
  );
}

export default SeekerList;