import {ExpressApp} from './express-app'
import { logger } from './utils';

const PORT = process.env.APP_PORT || 9000;

export const StratServer = async () => {
    const expressApp = await ExpressApp();
    expressApp.listen(PORT, ()=>{
        logger.info("Server Running on PORT:" + PORT)
    })

    process.on("uncaughtException", (err)=>{
        logger.error(err)
        process.exit(1)
    })
}

StratServer().then(()=>{
    logger.info("Server is up and running")
})