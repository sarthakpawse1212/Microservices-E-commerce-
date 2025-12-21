import * as cfg from './config'
import {ExpressApp} from './express-app'
import { logger } from './utils';

export const StratServer = async () => {
    const expressApp = await ExpressApp();
    expressApp.listen(cfg.APP_PORT, ()=>{
        logger.info("Server Running on PORT:" + cfg.APP_PORT)
    })

    process.on("uncaughtException", (err)=>{
        logger.error(err)
        process.exit(1)
    })
}

StratServer().then(()=>{
    logger.info("Server is up and running")
})