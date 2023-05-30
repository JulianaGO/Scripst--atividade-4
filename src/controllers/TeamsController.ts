import AppDataSource from "../data-source";
import { Request, Response } from "express";
import { Team } from "../entities/Teams";

class TeamsController {
    listByTermo(arg0: string, listByTermo: any) {
        throw new Error("Method not implemented.");
    }
  public async listTeams(req: Request, res: Response): Promise<Response> {
    const { termo} = req.params
    
    try{
      const teams: any[] = await AppDataSource.getRepository(Team).find({order:{name:'ASC'}})

      return res.status(200).json(teams)
    }catch(e){
      return res.status (500).json(e.message)
    }
    }
    public async create(req: Request, res: Response): Promise<Response> {  
      const { name } = req.body
      
      try{
        const team = await AppDataSource.getRepository(Team).save({ name })

        return res.status (200).json(team)
      }catch(e){
        let errorMessage =e.message
        if (errorMessage.includes("UNIQUE constraint")){
          errorMessage = " Nome já existente"
        }
        return res.status(500).json(errorMessage)
      }
  }
  public async update (req:Request, res: Response): Promise<Response>{
    const { id, name } = req.body

    try{
      const team = await AppDataSource.getRepository(Team).findOneBy({id})

      if(!team) return res.status(404).json ('Time não encontrado')

      team.name = name
      const updateTeam = await AppDataSource.getRepository(Team).save(team)

      return res.status(200).json (updateTeam)
    }catch(e){
      let errorMessage =e.message
      if (errorMessage.includes ("UNIQUE constrain")){
        errorMessage = "O nome já existe"
      }
      return res.status(500).json (errorMessage)
    }
    }
  public async delete (req:Request, res: Response): Promise<Response>{
    const { id } = req.body

    try{
      const team = await AppDataSource.getRepository(Team).findOneBy({id})

      if (!team) return res.status(400).json('Time não encontrado')

      await AppDataSource.getRepository(Team).delete(team)

      return res.status(200).json(`Time ${team.name}deletado`)

    }catch(e){
      return res.status(500).json(e.message)
    }
  }
  }


export default new TeamsController();
