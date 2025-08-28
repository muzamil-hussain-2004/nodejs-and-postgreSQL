const { Client } = require('pg')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(express.json())

const con = new Client({
    host: "localhost",
    user: process.env.dataBase_user,
    port: 5432,
    password: process.env.dataBase_password,
    database: "demopost"
})
con.connect(() => {
    try {
        console.log("connected");

    } catch (error) {
        console.error("Connection error:", error);
    }
})
app.post('/postData', (req, res) => {
    const { name, id, location, department } = req.body
    const insert_query = 'INSERT INTO demotable (name,id,location,department)  VALUES ($1,$2,$3,$4)'
    con.query(insert_query, [name, id, location, department], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.send(err)
        } else {
            console.log(result)
            console.log("POSTED DATA")
            return res.send("success")
        }
    })
})

app.get("/fetchData", (req, res) => {
    const fetch_data = 'SELECT name FROM demotable'
    con.query(fetch_data, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            const names = result.rows.map(row => row.name);
            res.send(names);
        }
    })
})

app.get("/getData/:id", (req, res) => {
    const { id } = req.params;
    const getDataId = "select * from demotable where id = $1"
    con.query(getDataId, [id], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result.rows)
        }
    })
})
app.put("/update/:id", (req, res) => {
    const { id } = req.params
    const department = req.body.department
    const update_query = "UPDATE demotable SET department=$1 WHERE id=$2"
    con.query(update_query, [department, id], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send("updated")
        }
    })
})
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params
    const delete_query = "DELETE FROM demotable WHERE id=$1"
    con.query(delete_query, [id], (err, result) => {
        if (err) {
            console.log("error while deleting", err);
            res.send(err)
        } else {
            console.log("deleted successfully", result)
            res.send(result)
        }
    })
})

app.listen(3000, () => {
    console.log("server is running")
})