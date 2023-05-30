import { Router } from "express";
import { TeamController } from "../controllers";
const routes = Router();

routes.get('/', TeamController.listTeams);
routes.get('/:termo', TeamController.listByTermo);
routes.post('/', TeamController.create);
routes.put('/', TeamController.update);
routes.delete('/', TeamController.delete);

export default routes;