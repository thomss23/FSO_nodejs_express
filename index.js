require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// morgan.token('body', req => {
//     return JSON.stringify(req.body)
// })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons  = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    Person
        .find({})
        .then((people) => {
            res.status(200).json(people);
        })
})

app.get("/info", (req,res) => {
    const response = `Phonebook has info for ${persons.length} people <br/> ${new Date()}`; 
    res.send(response)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id);

    if(person) {
        res.json(person)
    } else {
        res.status(404).end();
    }
    
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const id = persons.length > 0 ? Math.floor(Math.random() * 100) : 0;
    const body = req.body;

    const person = new Person({
        name:body.name,
        number: body.number
    })

    const personWithNameFromRequest = persons.find(p => p.name === body.name);

    if(!body.name) {
        return res.status(400).json({
            error: "name is missing from request"
        })
    }

    if(!body.number) {
        return res.status(400).json({
            error: "number is missing from request"
        })
    }

    if(personWithNameFromRequest) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    person.save()
          .then(result => res.json(result))
          .catch(err => console.log(err))

})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const newNumber = req.body.number;
    let updatedPerson;

    for(let i = 0; i < persons.length; i++) {
        if(persons[i].id === id) {
            persons[i].number = newNumber;
            updatedPerson = persons[i];
        }
        
    }

    if(!updatedPerson) {
        return res.status(404).json({
            error: "no such person present"
        })
    }

    if(!newNumber) {
        return res.status(400).json({
            error: "number is missing from request"
        })
    }

    res.json(updatedPerson)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})