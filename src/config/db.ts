import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

import Product from "../models/Product.model.ts";

// const dirname = process.cwd();

const db = new Sequelize( process.env.DB_URI!, {
   models: [ Product ],
   logging: false //Esto es para quitar el console.log de sequalize
});

export default db;

// Agregar ?ssl=true al final de la uri para lograr la conexión https en vez de http.
// Esto es requerido para conectar a la base de datos con SSL.