import { Request, Response, Router } from "express"
//require('dotenv').config({path:'./.env'});
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.port || 3000

app.use(express.json());
app.use(cors());

//importacion de rutas, mas adelante se cambia
import { AdopcionesRouter } from "./routes/adopciones.routes"
import { ApiResponse } from "./interfaces/ApiResponse.interface"
import { AuthRouter } from "./routes/auth.routes";


app.use(AdopcionesRouter);
app.use(AuthRouter);

app.get('/', (req:Request, res:Response) => {
	res.send('Test backend')
})

app.get('/api/mensaje', (req:Request, res:Response) => {
  const response:ApiResponse<string> = {
    data:'Mensaje desde el backend',
    statusCode:200,
  }
  res.send(response)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})