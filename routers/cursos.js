const express = require('express')
const Curso = require('../models/curso_model')
const ruta = express.Router()
const Joi = require('joi')

ruta.post('/', (req, res) => {
    let resultado = crearCurso(req.body)
        .then((curso) => {
            res.json(curso)
        })
        .catch((err) => {
            res.status(400).json({
                error : err
            })
        })
})

ruta.put('/:id', (req, res) => {
    
    let resultado = actualizarCurso(req.params.id, req.body)
        .then((curso)=> {
            res.json({
                valor : curso
            })
            })
       .catch((err) => {
            res.status(400).json({
                error : err
            })
       })

})

ruta.delete('/:id', (req, res) => {
    let resultado = desactivarCurso(req.params.id)
        .then((curso)=> {
            res.json({valor : curso})
        })
        .catch((err) => {
            res.status(400).json({error : err})
        })
})

ruta.get('/', async (req, res) => {
    let curso = consCursosActivos()
    .then((curso)=> {
        res.json({
            valor : curso
        })
    })
    .catch((err) => {
        res.status(400).json({
            error : err
        })
    })    
})

const crearCurso = async (body)=> {
    let {title, description} = body
    let curso = new Curso ({
        title : title,
        description : description
    })
    return await curso.save();
}

const actualizarCurso = async (id, body)=> {
    let {title, description} = body
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            title : title,
            description : description
        }
    }, {new : true})
    return curso
}

const desactivarCurso = async (id) => {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            state : false
        }
    }, {new : true})
    return curso
}

const consCursosActivos = async ()=> {
    let curso = await Curso.find({
        state : true
    })
    return curso;
}

module.exports = ruta;