import { Router } from "express";
import { MatchesController } from "../controllers";
const routes = Router();

routes.get('/', MatchesController.listMatches);
routes.get('/:id', MatchesController.listById);
routes.post('/', MatchesController.create);
routes.put('/', MatchesController.update);
routes.delete('/', MatchesController.delete);

export default routes;