const express = require('express')
const { Client } = require('pg')

const app = express()
app.use(express.json())

const user = new Client({
    host: "localhost",
    user: "saeed",
    port: "5432",
    password: "saeed",
    database: "demopost"
})

user.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected")
    }
})

app.post('/postData', (req, res) => {
    const { id, name, payment, amount } = req.body
    const insert_query = 'INSERT INTO custumers (id,name,payment,amount)  VALUES ($1,$2,$3,$4)'
    user.query(insert_query, [id, name, payment, amount], (err, result) => {
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

app.listen(5000, () => {
    console.log("server is running");
});

