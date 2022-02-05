const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


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

app.use(express.json())
morgan.token('body', (req, res)=> JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id===id)
  
    if(person){
      response.json(person)
    } else {
      response.status(404).end();
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== person)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*100 +1)
    const person = request.body
    console.log(person)
    Contact = 
    {
      id,
      name : person.name,
      number : person.number
    }

    if (persons.map(person => person.name).includes(person.name) === true)
      return response.status(400).json({error: 'name must be unique'})

    if(!person.name || !person.number){
      return response.status(404).json({error: 'name or number missing'}).end()
    }

    response.json(Contact)
    persons = persons.concat(Contact)
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info',(request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length}</p>
                   <p>${new Date()}</p>`)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })