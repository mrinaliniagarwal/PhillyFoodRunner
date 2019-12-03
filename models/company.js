var mongoose = require('mongoose')


mongoose.connect('mongodb+srv://cis197:<finalproject>@cluster0-bu7ni.mongodb.net/test?retryWrites=true&w=majority',
 { useUnifiedTopology: true },{useNewUrlParser: true});

var companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  supplytype: { type: String },
  supplyHistory: [{date: String, factory: String}], 
})


module.exports = mongoose.model('Company', companySchema)


