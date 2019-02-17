import Mcd from './lib/Mcd';


import app from './App'
import logger from './lib/Logger'


const port = process.env.EXPRESS_PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        return logger.error('error %s', err);
    }

    return logger.info('Listening on port %d', port);
});