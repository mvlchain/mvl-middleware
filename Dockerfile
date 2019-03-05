FROM easi6/alpine-node-buildtool
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --production=false
RUN yarn global add sequelize-cli

RUN apk add --update mysql-client

COPY build/server.js build/server.js.map
RUN mkdir -p logs

ARG COMMIT_HASH

ENV COMMIT_HASH=$COMMIT_HASH

#ENV NODE_ENV production
ENV NODE_ENV development

# mysql DB connect url setup
#ENV DATABASE_URL "mysql://easi6:easidb6customer@easi6_db:3306/easi6_customer_server_production"
ENV DATABASE_URL "mysql://drh:gkswoghk@docker.for.mac.localhost:3306/drh_easi6_vendor_development"

# mongo DB connect url setup
#ENV MONGO_URL "mongodb://easi6:easidb6customer@easi6_db/easi6_customer_server_production"
ENV MONGO_URL "mongodb://docker.for.mac.localhost/drh_easi6_vendor_server_development"

# redis connect url setup
#ENV REDIS_URL "redis://:easidb6customer@easi6_db:6379"
#ENV REDIS_URL "redis://:gkswoghk@docker.for.mac.localhost:6379"

# local.json override
ENV NODE_CONFIG '{\
  "jwt": {\
    "admin_secret": "easi6vendorsvradmin",\
    "manager_secret": "easi6vendorsvrmanager",\
    "driver_secret": "easi6vendorsvrdriver"\
  },\
  "redis": {\
    "host": "docker.for.mac.localhost",\
    "port": 6379,\
    "pass": "gkswoghk",\
    "auth": "gkswoghk",\
    "ttl": 86400\
  },\
  "winston": {\
    "transports": [{\
      "type": "DailyRotateFile",\
      "level": "debug",\
      "filename": "./logs/all.log",\
      "handleExceptions": true,\
      "json": false,\
      "maxsize": 104857600,\
      "colorize": false\
    }]\
  }
}'

ENV PORT 9000
ENV INTERFACE 0.0.0.0

EXPOSE 9000
CMD ["node", "-r", "source-map-support/register", "server.js"]
