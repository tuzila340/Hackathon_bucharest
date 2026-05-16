import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useState, useEffect } from "react"
import styles from "./Table.module.css"
import axios from "axios"

function SeekerList() {
    const [seekers, setSeekers] = useState([])

    useEffect(() => {
        const getSeekerList = async () => {
          await axios.get("http://127.0.0.1:8000/api/requests/", {
            headers: { 'Authorization': `Token ${token}`, }
          })
            console.log(response)
        }

        getSeekerList()
    }, [])

    return (
        <div>
            <TableContainer component={Paper} className={styles.glassContainer}>
                <Table sx={{ minWidth: 650 }} aria-label="seeker table">
                    <TableHead>
                        <TableRow className={styles.headRow}>
                            <TableCell className={styles.headCell}>Firstname</TableCell>
                            <TableCell className={styles.headCell}>Secondname</TableCell>
                            <TableCell className={styles.headCell}>Phone</TableCell>
                            <TableCell className={styles.headCell}>City</TableCell>
                            <TableCell className={styles.headCell}>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {seekers.length === 0 ? (
                            <TableRow className={styles.bodyRow}>
                                <TableCell colSpan={5} align="center" className={styles.emptyCell}>
                                    No seekers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            seekers.map((seeker, index) => (
                                <TableRow key={index} className={styles.bodyRow}>
                                    <TableCell className={styles.bodyCell}>
                                        {seeker.seekerfirstname}
                                    </TableCell>
                                    <TableCell className={styles.bodyCell}>
                                        {seeker.seekersecondname}
                                    </TableCell>
                                    <TableCell className={styles.bodyCell}>
                                        {seeker.seekerphone}
                                    </TableCell>
                                    <TableCell className={styles.bodyCell}>
                                        {seeker.seekercity}
                                    </TableCell>
                                    <TableCell className={styles.bodyCell}>
                                        {seeker.seekerstatus}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default SeekerList
