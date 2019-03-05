import config from 'config';
import _ from 'lodash';
import app from './app';
// @ts-ignore
import db from './external/db';

(async () => {
  /*
   * Load database
   */
  await db.sequelize.sync({ force: false });

  /*
   * port & interface setup
   */
  const port = process.env.PORT || _.get(config, 'host.port') || 9100;
  const intfc = process.env.INTERFACE || '127.0.0.1';

  app.listen(parseInt(port, 10), intfc, () => {
    console.log(`Server is listening at port=${port} intfc=${intfc}`);
  });
})();
