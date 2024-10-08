import express from "express";
import router from "./router.ts";
import db from "./config/db.ts";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

//Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggertUiOptions } from "./config/swagger.ts";

//Conectar a base de datos
export const connectDB = async () => {
   try{

      await db.authenticate();
      db.sync();
      // console.log(colors.blue("Conectado a la base de datos exitosamente!"));

   }catch(error){
      console.log(error);
      console.log(colors.red.bold("Error al conectar a la base de datos"));
   }
}

connectDB();

//Instancia de Express
const server = express();

//CORS
// server.use(cors());
const corsOptions : CorsOptions = {
   origin: (origin, callback) => {{
      if (origin === process.env.FRONTEND_URL) {
         callback(null, true)
      } else {
         callback(new Error('No permitido por CORS'))
      }
   }},
}

server.use(cors(corsOptions));

//Leer datos de formularios
server.use(express.json());

//Rutas
server.use(morgan('dev'));
server.use('/api/products', router);

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggertUiOptions));

export default server;