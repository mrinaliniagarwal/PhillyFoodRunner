var mongoose = require('mongoose')


mongoose.connect('mongodb+srv://cis197:<finalproject>@cluster0-bu7ni.mongodb.net/test?retryWrites=true&w=majority',
 { useUnifiedTopology: true },{useNewUrlParser: true});


var factorySchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  name: { type: String},
  address: { type: String},
  email: { type: String },
  storeSupply: [{supplytype: String, amount: Number}], 
  hoursOfOperation: { 
    startTime: {type : String},
    endTime: {type : String},
   },
})


module.exports = mongoose.model('Factory', factorySchema)


