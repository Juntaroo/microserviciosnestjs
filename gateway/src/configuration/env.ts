import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {
    PORT: number;
    MS_USER_HOST: string;
    MS_USER_PORT: number;
    MS_PRODUCTS_HOST: string;
    MS_PRODUCTS_PORT: number;
    MS_INVOICE_HOST: string;
    MS_INVOICE_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    MS_USER_HOST: joi.string().required(),
    MS_USER_PORT: joi.number().required(),
    MS_PRODUCTS_HOST: joi.string().required(),
    MS_PRODUCTS_PORT: joi.number().required(),
    MS_INVOICE_HOST: joi.string().required(),
    MS_INVOICE_PORT: joi.number().required()
}).unknown(true);


const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;
export const envs = {
    PORT: envVars.PORT,
    MS_USER_HOST: envVars.MS_USER_HOST,
    MS_USER_PORT: envVars.MS_USER_PORT,
    MS_PRODUCTS_HOST: envVars.MS_PRODUCTS_HOST,
    MS_PRODUCTS_PORT: envVars.MS_PRODUCTS_PORT,
    MS_INVOICE_HOST: envVars.MS_INVOICE_HOST || 'localhost',
    MS_INVOICE_PORT: envVars.MS_INVOICE_PORT || 3003
}