const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(number) { // olisi voinut käyttää regexiä
                // console.log("number is:", number)
                const divided = number.split('-')
                // console.log("divided length: ", divided.length)
                if (divided.length !== 2 || number.length < 9) return false
                const [part1, part2] = divided
                // console.log("part1 is: ", part1.length )
                if (!(part1.length == 2 || part1.length == 3)) {
                    // console.log("AFSAFESD")
                    return false
                }
    
                return true
                // return (number || '').replace(/[^0-9]/g, '').length >= 8
            },
            message: 'Phone number must contain at least 8 digits and consist of two parts divided by a dash. First part must be 2-3 digits.'
        }

    }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)