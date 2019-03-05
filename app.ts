import express from 'express';
import wrapAsync from 'express-wrap-async';
import * as awilix from 'awilix';
import {asFunction, asValue, AwilixContainer, GlobWithOptions, InjectionMode, Lifetime} from 'awilix';
import bodyParser from 'body-parser';
import _ from 'lodash';
import cors from 'cors';
import EOSConnector from "./lib/eos_connector.real";
import shimmer from 'shimmer';
import {RequestHandlerParams} from 'express-serve-static-core';
import {BuiltInNameFormatters, NameFormatter} from "awilix/lib/load-modules";
import routes from './api/routes';
import InMemoryMVLLogRepository from "./external/repositories/inmemory/mvllog_repository";
import SequelizeUserRepository from "./external/repositories/sequelize/user_repository";
import CreateNewUserUsecase from "./usecases/create_new_user_usecase";
import IssueMvpToUserUsecase from "./usecases/issue_mvp_to_user_usecase";
import UsersController from "./api/controllers/users_controller";
import config from "config";

const app = express();
const router = express.Router();
// IMPORTANT: wrapAsync is needed for handling throw in async function
['get', 'post', 'put', 'delete'].map((method: 'get' | 'post' | 'put' | 'delete') => {
  shimmer.wrap(router, method, original => {
    return function() {
      const wrapped: RequestHandlerParams = wrapAsync(_.get(arguments, '1'));
      _.set(arguments, '1', wrapped);
      return original.apply(this, arguments);
    };
  });
});

const container = awilix.createContainer();

container.register({
  // repos
  userRepository: awilix.asClass(SequelizeUserRepository),
  userJsonPath: awilix.asValue(`${__dirname}/users.json`),

  logRepository: awilix.asClass(InMemoryMVLLogRepository),

  // eos
  // eosConnector: awilix.asClass(EOSConnectorMock),
  endpoint: awilix.asValue(config.get<any>("eos").host),
  eosConnector: awilix.asClass(EOSConnector),
});


app.use(
  bodyParser.urlencoded({
    limit: '5mb',
    extended: true,
    parameterLimit: 10000,
  })
);
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ type: 'text/*' }));


// install routes
container.register({
  router: asValue(router),
});

export interface Request extends express.Request {
  container: AwilixContainer;
}

app.use((req: Request, res, next) => {
  req.container = container.createScope();
  next();
});

function registerModule(
  globPattern: Array<string | GlobWithOptions>,
  formatName?: NameFormatter | BuiltInNameFormatters
): void {
  container.loadModules(globPattern, {
    formatName: formatName || 'camelCase',
    cwd: '.',
    resolverOptions: {
      injectionMode: InjectionMode.PROXY,
      lifetime: Lifetime.SINGLETON
    }
  });
}

// loading biz logic
container.register({
  createNewUserUsecase: awilix.asClass(CreateNewUserUsecase),
  issueMvpToUserUsecase: awilix.asClass(IssueMvpToUserUsecase),
});

// loading controllers
container.register({
  usersController: awilix.asClass(UsersController),
});

// loading routes
container.register({routes: asFunction(routes).classic()});
container.resolve('routes');

app.use(router);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Disposition'],
};
const corsHosts = process.env.CORS_HOSTS;
let corsRegexes = [];
if (corsHosts) {
  corsRegexes = _.map(corsHosts.split(' '), h => new RegExp(h));
  _.assign(corsOptions, {
    origin: corsRegexes,
  });
}
app.use(cors(corsOptions));
app.disable('etag');

export default app;