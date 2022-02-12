
// node_modules/.bin/nodemon index.js
// node-repl
// npm run dev
// https://morning-reef-54351.herokuapp.com/api/persons

const express = require('express')
const app = express()
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
response.send(`<p>Phonebook has info for ${len} people</p>
<p>${new Date().toString()}</p>`)
})
// .catch(error => {
//     console.error(error.message)
// })

app.get('/info', (request, response) => {
response.send('<h1>Hello You!</h1>')
})

app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
    // response.json(person)
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    :0

    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    
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
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
    console.log(persons)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()

})


// const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})