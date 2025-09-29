const mongoose = require('mongoose')

const RoxDataSchema = new mongoose.Schema({
    id:{type: Number, required: true},
    title:{type: String, required: true},
    price:{type: Number, required: true},
    description:{type: String, required: true},
    category:{type: String, required: true},
    image:{type: String, required: true},
    sold:{type: Boolean, default: false},
    dateOfSale: { type: Date, required: true }
	
});

const transactionModule = mongoose.model('roxColl',RoxDataSchema);

module.exports = transactionModule;
