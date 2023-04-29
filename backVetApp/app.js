const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

app.get('/',cors(), (req, res) => {
  res.send('Test backend')
})

app.get('/api/mensaje',cors(), (req, res) => {
  res.send({
    data:'Mensaje desde el backend',
    statusCode:200,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})