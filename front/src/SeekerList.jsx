import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
        setSeekers([]);
      } else {
        console.error("Error fetching profile:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchSeekers();
  }, []);

  return (
    <div>
      <h1>Seeker List</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="seeker table">
          <TableHead>
            <TableRow>
              <TableCell>Firstname</TableCell>
              <TableCell>Secondname</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seekers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No seekers found
                </TableCell>
              </TableRow>
            ) : (
              seekers.map((seeker, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{seeker.seekerfirstname}</TableCell>
                  <TableCell>{seeker.seekersecondname}</TableCell>
                  <TableCell>{seeker.seekerphone}</TableCell>
                  <TableCell>{seeker.seekercity}</TableCell>
                  <TableCell>{seeker.seekerstatus}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SeekerList;