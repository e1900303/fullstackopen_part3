require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

// const url =
// 'mongodb+srv://tduyphat:Duyphat080300@cluster0.bhss4.mongodb.net/phonebook?retryWrites=true&w=majority'

// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

const Person = require('./models/person')

// personSchema.set('toJSON', {
//   transform: (person, returnedPerson) => {
//     returnedPerson.id = returnedPerson._id.toString()
//     delete returnedPerson._id
//     delete returnedPerson.__v
//   }
// })

let persons = [
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

app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res)=> JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
   .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
    })
    .catch(error => next(error))
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id===id)
  
//     if(person){
//       response.json(person)
//     } else {
//       response.status(404).end();
//     }
//   })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== person)
  
//     response.status(204).end()
//   })

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

// app.post('/api/persons', (request, response) => {
//     const id = Math.floor(Math.random()*100 +1)
//     const person = request.body
//     console.log(person)
//     Contact = 
//     {
//       id,
//       name : person.name,
//       number : person.number
//     }

//     if (persons.map(person => person.name).includes(person.name) === true)
//       return response.status(400).json({error: 'name must be unique'})

//     if(!person.name || !person.number){
//       return response.status(404).json({error: 'name or number missing'}).end()
//     }

//     response.json(Contact)
//     persons = persons.concat(Contact)
//   })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/persons', (request, response) => {
//     response.json(persons)
//   })

app.get('/info',(request, response) => {
  Person.count({}).then(length => {
    response.send(`<p>Phonebook has info for ${length}</p>
                   <p>${new Date()}</p>`)
  })
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

app.use(errorHandler)