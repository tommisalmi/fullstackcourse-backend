const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const len = process.argv.length

// console.log("Connecting to the database...")

const url = `mongodb+srv://fullstack:${password}@cluster0.pcwot.mongodb.net/personApp?retryWrites=true&w=majority`
//   `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// console.log("len is: ", len)
mongoose.connect(url)

// console.log("wadap")
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
const printPerson = (person) => {
    console.log(`${person.name} ${person.number}`)
}

if (len === 3) {
    // (async function () {
    //     const result = await Person.find({});
    //     console.log("phonebook:")
    //     result.forEach(person => {
    //       printPerson(person)
    //     })
    //     await mongoose.connection.close();
    //     console.log('adsasd')
    // })();

    Person.find({}).then((result) => {
        // console.log("phonebook:")
        result.forEach((person) => {
            printPerson(person)
        })
        // console.log("hei")
        mongoose.connection.close()
        // console.log("hoi")
    })
}

else if (len === 5) {
    const person = new Person({
        name,
        number,
    })

    person.save().then((result) => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

else {
    console.log('Something went wrong, check the syntax for this application')
    mongoose.connection.close()
}
