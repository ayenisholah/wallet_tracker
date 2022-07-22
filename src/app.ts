import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import jsYaml from 'js-yaml';
import { createHttpTerminator } from 'http-terminator';
import config from './config';
import { stream } from './utils/logger';

import { Server } from 'http';
import path from 'path';
import fs from 'fs';

import { logInfo, sleep } from './utils/util';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public server: Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = config.app.port;
    this.env = config.app.env;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public async listen(): Promise<Server> {
    await new Promise((resolve, reject) => {
      this.server = this.app
        .listen(this.port)
        .once('listening', resolve)
        .once('error', reject);
    });
    await sleep(2000);
    logInfo(`🚀 App listening on the port ${this.port}`);

    return this.server;
  }

  public async close(): Promise<void> {
    const httpTerminator = createHttpTerminator({ server: this.server });
    await httpTerminator.terminate();
  }

  readonly whitelist: string[] = [...(config.clients as string[])];

  private corsOptions: cors.CorsOptions = {
    origin: (origin: string, callback) => {
      if (this.whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS.'));
      }
    },
    credentials: true,
  };

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors(this.corsOptions));
    } else if (this.env === 'development' || this.env === 'staging') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ credentials: true, origin: true }));
    }

    this.app.options('*', cors({ optionsSuccessStatus: 204 }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const openAPIYamlFile = fs.readFileSync(
      path.resolve(__dirname, './docs/openAPI.spec.yaml'),
      'utf-8',
    );

    const swaggerSpecAsObject = jsYaml.load(openAPIYamlFile);

    this.app.get('/swagger.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(swaggerSpecAsObject));
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecAsObject));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
