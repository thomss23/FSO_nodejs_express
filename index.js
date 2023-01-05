require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "BadRequestError";
    }
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 

    if(error.name === "BadRequestError") {
        return response.status(400).json({
            error: error.message
        })
    }
  
    next(error)
}

// morgan.token('body', req => {
//     return JSON.stringify(req.body)
// })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get("/api/persons", (req, res) => {
    Person
        .find({})
        .then((people) => {
            res.status(200).json(people);
        })
        .catch(err => next(err))
})

app.get("/info", (req,res) => {
    Person
    .find({})
    .then((people) => {
        res.send(`Phonebook has info for ${people.length} people <br/> ${new Date()}`);
    })
    .catch(err => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            console.log(person);
            if(person) {
                res.json(person)
            } else {
                res.status(404).end();
            }
        })
        .catch(err => next(err))
        
    
})

app.delete("/api/persons/:id", (req, res, next) => {
    console.log(req.params.id)
    Person.findByIdAndRemove(req.params.id)
          .then(result => res.status(204).end())
          .catch(error => next(error))

})

app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    if(!body.name) {
        throw new BadRequestError("name is missing from request")
    }

    if(!body.number) {
        throw new BadRequestError("number is missing from request")
    }

    const person = new Person({
        name:body.name,
        number: body.number
    })
    
    Person.find({name : body.name})
          .then(result => {
            console.log(result)
            if(result.length > 0) {
                throw new BadRequestError("name must be unique")
            }
            return;
          })
          .then(() => {
            return person.save()
            .then(result => res.json(result))
            .catch(err => next(err))
          })
          .catch(err => {
              return next(err)
          })

})

app.put('/api/persons/:id', (req, res) => {

    if(!req.body.number) {
        throw new BadRequestError("number is missing from request")
    }

    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))

})

app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})