import { Request, Response, Router } from "express"

const express = require('express')
var cors = require('cors')
const app = express()
const PORT = process.env.port || 3000

//importacion de rutas, mas adelante se cambia
import { AdopcionesRouter } from "./routes/adopciones"
import { TurnosRouter  } from "./routes/turnos"
import { ApiResponse } from "./interfaces/ApiResponse.interface"

app.use(cors());
app.use(AdopcionesRouter);
app.use(TurnosRouter);

app.get('/',cors(), (req:Request, res:Response) => {
	res.send('Test backend')
})

app.get('/api/mensaje',cors(), (req:Request, res:Response) => {
  const response:ApiResponse<string> = {
    data:'Mensaje desde el backend',
    statusCode:200,
  }
  res.send(response)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})