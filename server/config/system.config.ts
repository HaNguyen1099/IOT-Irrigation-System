import * as dotenv from "dotenv";

dotenv.config();

export class Config {
    // Port
    PORT = +process.env.PORT || 3000;

    // Postgresql
    postgresHost = process.env.POSTGRES_HOST;
    postgresPort = +process.env.POSTGRES_PORT;
    postgresUser = process.env.POSTGRES_USER;
    postgresPassword = process.env.POSTGRES_PASSWORD;
    postgresDatabase = process.env.POSTGRES_DATABASE;

    // JWT 
    JWTSecret = process.env.JWT_SECRET
    JWTExpire = process.env.JWT_EXPIRE_IN

    // EMAIL
    MailHost = process.env.MAIL_HOST
    MailUser = process.env.MAIL_USER
    MailPassword = process.env.MAIL_PASSWORD
    MailFrom = process.env.MAIL_FROM
    MailTransport = process.env.MAIL_TRANSPORT
}

export const configSystem = new Config();