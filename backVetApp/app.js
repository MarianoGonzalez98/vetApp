const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Test backend')
})

app.get('/api/mensaje', (req, res) => {
  res.send('Mensaje desde el backend')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})