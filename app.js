const express = require('express')
const mongoose = require('mongoose')
const usuarios = require('./routers/usuario')
const cursos = require('./routers/cursos')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/api/usuarios', usuarios)
app.use('/api/cursos', cursos)

//conexion con DB

mongoose.connect('mongodb://localhost:27017/Demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=> console.log('Conectado a la BD'))
    .catch(err => console.log(`No se puede conectar, error ${err} `))


const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server on port ${port}`)
})