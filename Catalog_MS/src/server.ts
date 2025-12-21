import expressApp from './expressApp'
import { logger } from './utils';

const PORT = process.env.PORT || 8000;

export const StratServer = async () => {
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