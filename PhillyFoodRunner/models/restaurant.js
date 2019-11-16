var mongoose = require('mongoose')

var restaurantSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  name: { type: String},
  address: { type: String},
  email: { type: String },
  hoursOfOperation: { 
    startTime: {type : Number},
    endTime: {type : Number},
   },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
