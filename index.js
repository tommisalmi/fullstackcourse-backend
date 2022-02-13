
// node_modules/.bin/nodemon index.js
// node-repl
// npm run dev
// https://morning-reef-54351.herokuapp.com/api/persons
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
app.use(express.json())
app.use(express.static('build'))


const cors = require('cors')
app.use(cors())
const morgan = require('morgan') //let's us log the time it takes to process the request and other info.



// app.use(morgan('tiny'))

// app.use(morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms',
//       JSON.stringify(req.body)
    
//     ].join(' ')
//   })) 
// morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('last', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res), 'ms',
    // tokens.type(req,res),
    tokens.last(req,res)
    // JSON.stringify(req.body) // logs the last posted person also when other requests are processed
  ].join(' ')))

//   morgan.token('type', function (req, res) { return req.headers['content-type'] })

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
console.log("heyy")
const len = persons.length



app.get('/info', (request, response) => {

    Person.find({}).then(result => {
        // response.json(result)
        response.send(`<p>Phonebook has info for ${result.length} people</p>
        <p>${new Date().toString()}</p>`
        )
    })
//     response.send(`<p>Phonebook has info for ${len} people</p>
// <p>${new Date().toString()}</p>`)
})
// .catch(error => {
//     console.error(error.message)
// })

// app.get('/info', (request, response) => {
// response.send('<h1>Hello You!</h1>')
// })

app.get('/api/persons', (request, response) => {
    // const people = []
    Person.find({}).then(result => {
        console.log("here")
        response.json(result)
    })
    // console.log("people are", people)
    // response.json(persons) 
})

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        // response.json(person)
    })
    .catch(error => next(error))
    
    // response.json(person)
})

// const generateId = () => {
//     const maxId = persons.length > 0
//     ? Math.max(...persons.map(person => person.id))
//     :0

//     return maxId + 1
// }

app.post('/api/persons', (request, response, next) => {
    
    const body = request.body
    // console.log(request)
    // console.log(persons)
    // console.log(body)
    if(!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    if(persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }
    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
    // }) {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number
    // }
    // persons = persons.concat(person)
    // console.log(person)
    // response.json(person)
    // console.log(persons)
  })

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // console.log(persons)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    console.log("working")
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(result => {
        response.json(person)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  // tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
  app.use(errorHandler)


// const PORT = 3001
// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})