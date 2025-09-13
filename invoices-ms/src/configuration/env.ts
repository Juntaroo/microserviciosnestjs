import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {//Estoy definiendo en envars para las variables de entorno
    DB_PORT: number;
    DB_HOST: string;
    DB_URL: string;
    HOST: string;
    PORT: number;
}

//Les doy el formato JOI
const envsSchema = joi.object({
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_URL: joi.string().required(),
    HOST: joi.string().required(),
    PORT: joi.number().required(),
}).unknown(true);


const { error, value } = envsSchema.validate(process.env);//Lo que este en el env tendra este esquema

if (error) throw new Error(`Cofig validation error: ${error.message}`);//En caso de error que mande un mensaje

//Termino de establecer el valor
const envVars: EnvVars = value;

//Aca se lo doy a una variable para poder utilizarlo globalmente
export const envs = {
    DB_PORT: envVars.DB_PORT,
    DB_HOST: envVars.DB_HOST,
    DB_URL: envVars.DB_URL,
    HOST: envVars.HOST,
    PORT: envVars.PORT,
}