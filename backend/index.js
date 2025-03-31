import express from 'express'
import mysql from 'mysql'

const app = express()
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: ""
})

app.get("/", (req, res) => {
  res.json("Hello this is the backend")
})

app.get("/course", (req, res) => {
  const q = "SELECT * FROM courses"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/professor", (req, res) => {
  const q = "SELECT * FROM professor"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.get("/has_as_prereq", (req, res) => {
  res.json("has_as_prereq")
})

app.get("/has_as_antireq", (req, res) => {
  res.json("has_as_antireq")
})

app.get("/requires", (req, res) => {
  res.json("requires")
})

app.get("/textbook", (req, res) => {
  const q = "SELECT * FROM textbook"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/student", (req, res) => {
  res.json("student")
})

app.get("/has_taken", (req, res) => {
  res.json("has_taken")
})

app.get("/section", (req, res) => {
  const q = "SELECT * FROM section"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/department", (req, res) => {
  res.json("department")
})

app.get("/admin_staff", (req, res) => {
  res.json("admin_staff")
})

app.get("/works_for", (req, res) => {
  res.json("works_for")
})

app.get("/support_staff", (req, res) => {
  res.json("support_staff")
})

app.get("/degree_program", (req, res) => {
  res.json("degree_program")
})

app.get("/undergraduate", (req, res) => {
  res.json("undergraduate")
})

app.get("/graduate", (req, res) => {
  res.json("graduate")
})

app.get("/teaching_staff", (req, res) => {
  res.json("teaching_staff")
})

app.listen(8800, () => {
  console.log("Connected to backend!")
})
