import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

// Defino el modelo de mis variables de entorno
interface EnvVars {
    PORT: number;
    MS_USER_HOST: string;
    MS_USER_PORT: number;
    MS_PRODUCTS_HOST: string;
    MS_PRODUCTS_PORT: number;
    MS_FACTURA_HOST: string;
    MS_FACTURA_PORT: number;
}

// Defino el modelo de mis variables de entorno con JOI
const envsSchema = joi.object({
    PORT: joi.number().required(),
    MS_USER_HOST: joi.string().required(),
    MS_USER_PORT: joi.number().required(),
    MS_PRODUCTS_HOST: joi.string().required(),
    MS_PRODUCTS_PORT: joi.number().required(),
    MS_FACTURA_HOST: joi.string().required(),
    MS_FACTURA_PORT: joi.number().required()
}).unknown(true);

// Valido que las variables definidas en mi archivo `.env` sigan la estructura que defini en JOI
const { error, value } = envsSchema.validate(process.env);

// Si hay un error lo muestro
if (error) throw new Error(`Config validation error: ${error.message}`);

// Establezco que el resultado de la validacion de JOI es del tipo de mi interfaz
const envVars: EnvVars = value;

// Creo constante que utilizare a lo largo de mi proyecto
export const envs = {
    PORT: envVars.PORT,
    MS_USER_HOST: envVars.MS_USER_HOST,
    MS_USER_PORT: envVars.MS_USER_PORT,
    MS_PRODUCTS_HOST: envVars.MS_PRODUCTS_HOST,
    MS_PRODUCTS_PORT: envVars.MS_PRODUCTS_PORT,
    MS_FACTURA_HOST: envVars.MS_FACTURA_HOST || 'localhost',
    MS_FACTURA_PORT: envVars.MS_FACTURA_PORT || 3002
}