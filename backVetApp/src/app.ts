import { NextFunction, Request, Response, Router } from "express"
//require('dotenv').config({path:'./.env'});
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: ['http://localhost:5173','https://ohmydog.azurewebsites.net','https://ohmydogunlp.netlify.app'],
  credentials: true,
  //preflightContinue: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

const cron = require('node-cron');

const types = require('pg').types //para que el tipo numeric se tome como numero y no como string
types.setTypeParser(1700, function(val:any) {
    return Number(val);
});

cron.schedule('* * * * *', async () => {
  const result = await getTurnosPendientesPasados();

  if (result === "error") {
    console.log("Falló la eliminacion automática de turnos pasados no aceptados ni rechazados")
    return
  }

  if (result.length > 0) { // Hay turnos pasados
    for (var i = 0; i < result.length; i++) {
      cancelarTurno(result[i].id) // los elimina uno a uno y envia el mail correspondiente

      if (result[i].rangoHorario === "Manana") {
        result[i].rangoHorario = "Mañana";
      }

      let email = result[i].emailOwner;
      //let emailDestinatario = result[i].emailOwner;
      let asunto = "Solicitud de turno Cancelado"
      let texto = `¡Se le ha cancelado un turno!
      <br><br>
      El veterinario no respondió a su solicitud.<br>
      A continuación te dejamos los datos del turno.<br>
      
      Fecha: ${result[i].fecha}<br>
      Rango horario: ${result[i].rangoHorario}<br>
      Perro: ${result[i].perroNombre}`;

      try {
        sendMailTest(email, asunto, texto);
      } catch (error) {
        console.log(error);
      }

    }
  }

});

//importacion de rutas, mas adelante se cambia
import { AdopcionesRouter } from "./routes/adopciones.routes"
import { TurnosRouter } from "./routes/turnos.routes"
import { ApiResponse } from "./interfaces/ApiResponse.interface"
import { AuthRouter } from "./routes/auth.routes";
import { TestRouter } from "./routes/test.routes";
import { PerrosRouter } from "./routes/perros.routes";
import { ClientesRouter } from "./routes/clientes.routes";
import { PaseadoresCuidadoresRouter } from "./routes/paseadoresycuidadores.routes";
import { MailerRouter } from "./routes/mailer.routes";
import { cancelarTurno, getTurnosPendientesPasados } from "./services/turno.service";
import { sendMailTest } from "./utils/mailer.handle";
import { DonacionesRouter } from "./routes/donaciones.routes";
import { MercadoPagoRouter } from "./routes/mercadoPago.routes";

app.use(AdopcionesRouter);
app.use(TurnosRouter);
app.use(AuthRouter);
app.use(TestRouter);
app.use(PerrosRouter);
app.use(ClientesRouter)
app.use(PaseadoresCuidadoresRouter);
app.use(MailerRouter)
app.use(DonacionesRouter)
app.use(MercadoPagoRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Test backend')
})

app.get('/api/mensaje', (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    data: 'Mensaje desde el backend',
    statusCode: 200,
  }
  res.send(response)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

