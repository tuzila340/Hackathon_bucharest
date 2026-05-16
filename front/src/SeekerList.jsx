import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from "react";

function createData(
  firstname: string,
  secondname: string,
  phone: string,
  city: string,
  status: string,
){
  return { firstname, secondname, phone, city, status };
}

const rows = [
  
]


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
    <div>
        <h1>Seeker List</h1>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  );
}

export default SeekerList;