import { Router } from "express"
import { sendMailController } from "../controllers/test";

const TestRouter = Router();
TestRouter.get("/test/sendmail",sendMailController);


export {TestRouter}