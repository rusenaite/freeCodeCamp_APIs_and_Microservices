/** # MONGOOSE SETUP #
/*  ================== */

/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

require('dotenv').config();

/** 2) Create a Model */
const { Schema } = mongoose;
const personSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model("Person", personSchema);

/** 3) Create and Save a Record of a Model */
const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: 'Person',
    age: 19,
    favoriteFoods: [ 'chicken', 'yogurt', 'salad' ]
  });
  
  newPerson.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

/** 4) Create Many Records with model.create() */
const arrayOfPeople = [
  {name: "Anna", age: 19, favoriteFoods: ["pasta", "yogurt"]},
  {name: "Jack", age: 22, favoriteFoods: ["chicken", "apples"]},
  {name: "Mary", age: 21, favoriteFoods: ["steak"]},
  {name: "John", age: 23, favoriteFoods: ["pizza"]},
  {name: "Mary", age: 18, favoriteFoods: ["fish", "tacos"]}
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
  if (err) return console.error(err);
  done(null, people);
  });
};

/** 5) Use model.find() to Search Your Database */
const findPeopleByName = (personName, done) => {
  Person.find({ 
    name: personName 
  }, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
    });
};

/** 6) Use model.findOne() to Return a Single Matching Document from Your Database */
const findOneByFood = (food, done) => {
  Person.findOne({ 
    favoriteFoods: food 
  }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
    });
};

/** 7) Use model.findById() to Search Your Database By _id */
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
    });
};

/** 8) Perform Classic Updates by Running Find, Edit, then Save */
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => {
    if (err) return console.log(err);
    done(null, updatedPerson);
    })
  })
};

/** 9) Perform New Updates on a Document Using model.findOneAndUpdate() */
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    {name: personName}, 
    {age: ageToSet},
    {new: true},
    (err, updatedPerson) => {
      if (err) return console.log(err);
      done(null, updatedPerson);
    })
};

/** 10) Delete One Document Using model.findByIdAndRemove */
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedDoc) => {
    if(err) return console.log(err);
    done(null, removedDoc);
  });
};

/** 11) Delete Many Documents with model.remove() */
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, removedPeople) => {
    if(err) return console.log(err);
    done(null, removedPeople);
  })
};

/** 12) Chain Search Query Helpers to Narrow Search Results */
const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch})
    .sort({ name: 'asc' })
    .limit(2)
    .select({ age: 0 })
    //callback
    .exec((err, docs) => {
      done(null, docs);
    });
};

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
