const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario_model')
const ruta = express.Router()
const Joi = require('joi')

// Validaciones de datos

const schema = Joi.object({
    name: Joi.string()        
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

const verificarToken = (req, res, next)=> {
    let token = req.get('Token')
    console.log(token)
    jwt.verify(token, config.get('configToken.SEED')), (err, decoded) => {
        if(err) {
            return res.status(401).json({err})
        }
    }
    res.send(token)
    next()
}

ruta.get('/', verificarToken, async (req, res, ) => {
    let usuarios = consUsuariosActivos()
    .then((user)=> {
        res.json({
            valor : user
        })
    })
    .catch((err) => {
        res.status(400).json({
            error : err
        })
    })    
})

ruta.post('/', (req, res) => {
    let body = req.body

    Usuario.findOne({email : req.body.email}, (err, user) => {
        if(err) {
            return res.status(400).json({error: "Server Error"})
        }
        if(user) {
            return res.status(400).json({msg: "Usuario Duplicado"})
        }
    })

    const {error, value} = schema.validate({
        name: req.body.name,
        email : req.body.email
    })

    if (!error) {
        let resultado = crearUsuario(body)
            .then((user)=> {
                res.json({
                    name : user.name,
                    email : user.email
                })
            })
            .catch((err) => {
                res.status(400).json({
                    error : err
                })
            })
    } else {
        res.status(400).json({
            error : error
        })
    }
})

ruta.put('/:email', (req, res) => {
    
    const {error, value} = schema.validate({
        name : req.body.name
    })

    if (!error) {
        let resultado = actualizarUsuario(req.params.email, req.body)
            .then((user)=> {
                res.json({
                    name : user.name,
                    email : user.email
                })
            })
            .catch((err) => {
                res.status(400).json({
                    error : err
                })
            })
    } else {
        res.status(400).json({error})
    }
})

ruta.delete('/:email', (req, res) => {
    let resultado = desactivarUsuario(req.params.email)
        .then((user)=> {
            res.json({
                name : user.name,
                email : user.email
            })
        })
        .catch((err) => {
            res.status(400).json({
                error : err
            })
        })
})

const consUsuariosActivos = async ()=> {
    let usuario = await Usuario.find({
        state : true
    }).select({name:1, email:1 })
    return usuario;
}

const crearUsuario = async (body)=> {
    let {email, name, password} = body
    let usuario = new Usuario ({
        email : email,
        name : name,
        password : bcrypt.hashSync(password, 10)
    })
    return await usuario.save();
}

const actualizarUsuario = async (email, body)=> {
    let {name, password} = body
    let usuario = await Usuario.findOneAndUpdate(email, {
        $set: {
            name : name,
            password : password
        }
    }, {new : true})
    return usuario
}

const desactivarUsuario = async (email)=> {
    let usuario = await Usuario.findOneAndUpdate(email, {
        $set: {
            state : false
        }
    }, {new : true})
    return usuario
}

module.exports = ruta;