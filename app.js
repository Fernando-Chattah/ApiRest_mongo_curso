const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const usuarios = require('./routers/usuario')
const auth = require('./routers/auth')
const cursos = require('./routers/cursos')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/api/usuarios', usuarios)
app.use('/api/cursos', cursos)
app.use('/api/auth', auth)

//conexion con DB

mongoose.connect(config.get('configDB.HOST'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=> console.log('Conectado a la BD'))
    .catch(err => console.log(`No se puede conectar, error ${err} `))


const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server on port ${port}`)
})