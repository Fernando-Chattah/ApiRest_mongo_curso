const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const Usuario = require('../models/usuario_model')
const ruta = express.Router()
/* const Joi = require('joi') */

ruta.post('/', (req, res) => {
    Usuario.findOne({email: req.body.email})
        .then((datos => {
            if(datos) {
                const passwordValida = bcrypt.compareSync(req.body.password, datos.password)
                if (!passwordValida) {
                    return res.status(400).json({error:'ok', msj: 'Usuario o Clave Incorrecta'})
                }
                const jwtoken = jwt.sign({
                    data : {id: datos._id, name: datos.name, email: datos.email}
                }, config.get('configToken.SEED'), {expiresIn: config.get('configToken.expiration')})
                /* const jwtoken = jwt.sign({
                    id: datos._id, 
                    name: datos.name,
                    email: datos.email}, 'password') */
                res.json({
                    usuario: {
                        _id : datos._id,
                        name: datos.name,
                        email: datos.email
                    }, 
                    jwtoken
                });
            } else {
                res.status(400).json({
                    error: 'ok',
                    msg: 'Usuario o Clave Incorrecta'
                })
            }
        }))
        .catch(err => {
            res.status(400).json({
                error: 'ok',
                msj: 'Error en el servicio' + err 
            })
        })
})

module.exports = ruta