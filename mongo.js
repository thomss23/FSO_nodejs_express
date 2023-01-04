const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.juy2jtk.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .catch((err) => console.log(err))

if(name && number) {
    const person = new Person( {
        name: name,
        number: number
    })

    person.save()
    .then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
    Person
      .find({})
      .then((persons) => {
        console.log("phonebook:")
        persons.forEach(person => console.log(`${person.name} ${person.number}`))
        return mongoose.connection.close()
    })     
}