const mongoose = require('mongoose')

const cursoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    state : {
        type : Boolean,
        default : true
    },
    image : {
        type : String,
        require: false
    },
    studients : {
        type : Number,
        default : 0
    },
    qualification : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('Curso', cursoSchema);