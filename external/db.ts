import { Sequelize } from 'sequelize-typescript';
import config from 'config';
import URL from 'url';
import { SequelizeConfig } from 'sequelize-typescript/lib/types/SequelizeConfig';
import _ from 'lodash';
import {User} from "../entities/types/user";
import UserEntity from "./entities";

let sequelize;

const dbConfig: SequelizeConfig = {
  database: '',
  password: '',
  username: '',
};

if (config.has('database')) {
  _.assign(dbConfig, config.get('database'));
}

if (process.env.DATABASE_URL) {
  const databaseUrl = process.env.DATABASE_URL;

  const urlParts: any = URL.parse(databaseUrl);

  dbConfig.dialect = urlParts.protocol.replace(/:$/, '');
  dbConfig.host = urlParts.hostname;

  if (urlParts.pathname) {
    dbConfig.database = urlParts.pathname.replace(/^\//, '');
  }

  if (urlParts.port) {
    dbConfig.port = urlParts.port;
  }

  if (urlParts.auth) {
    const authParts = urlParts.auth.split(':');

    dbConfig.username = authParts[0];

    if (authParts.length > 1) {
      dbConfig.password = authParts.slice(1).join(':');
    }
  }

}


// dbConfig.logging = stream.db;
dbConfig.pool = dbConfig.pool || {
  acquire: 30000,
  idle: 10000,
  max: 150,
  min: 1,
};

sequelize = new Sequelize(dbConfig);

sequelize.addModels([UserEntity]);


export default {
  Sequelize,
  sequelize,
};
