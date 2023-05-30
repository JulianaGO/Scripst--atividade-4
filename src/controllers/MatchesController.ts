import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Team } from "../entities/Teams";
import { Match } from "../entities/Match";

class MatchesController {

  public async listMatches(req: Request, res: Response): Promise<Response> {
    const { limit, offset } = req.body

    try {
      const matches: any[] = await AppDataSource.getRepository(Match).find({ skip: offset, take: limit, order: { date: 'DESC' }, relations: { host: true, visitor: true } })

      return res.status(200).json(matches)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  public async listById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      const idAsNumber: number = parseInt(id)
      const team = await AppDataSource.getRepository(Team).findOneBy({id: idAsNumber})
      const matches = await AppDataSource.getRepository(Match).find({
        relations: { host: true, visitor: true },
        where:
          [{ host: team },
          { visitor: team }],
        order: { date: 'DESC' }
      })

      return res.status(200).json(matches)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { idhost, idvisitor, date } = req.body

    try {
      const idHost: number = parseInt(idhost)
      const idVisitor: number = parseInt(idvisitor)

      const host = await AppDataSource.getRepository(Team).findOneBy({ id: idHost })

      if (!host) return res.status(404).json('Mandante desconhecido')

      const visitor = await AppDataSource.getRepository(Team).findOneBy({ id: idVisitor })

      if (!visitor) return res.status(404).json('Visitante desconhecido')

      let match: Match;

      if (date) {
        const dateAsDate: Date = new Date(date)
        match = await AppDataSource.getRepository(Match).save({ host: host, visitor: visitor, date: dateAsDate })
      } else {
        match = await AppDataSource.getRepository(Match).save({ host: host, visitor: visitor })
      }

      return res.status(200).json(match)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, idhost, idvisitor, date } = req.body

    try {
      const match = await AppDataSource.getRepository(Match).findOneBy({ id })

      if (!match) return res.status(404).json('Partida não encontrada')

      const idHost: number = parseInt(idhost)
      const idVisitor: number = parseInt(idvisitor)

      const host = await AppDataSource.getRepository(Team).findOneBy({ id: idHost })

      if (!host) return res.status(404).json('Mandante desconhecido')

      const visitor = await AppDataSource.getRepository(Team).findOneBy({ id: idVisitor })

      if (!visitor) return res.status(404).json('Visitante desconhecido')

      match.host = host
      match.visitor = visitor
      if (date) {
        const dateAsDate: Date = new Date(date)
        match.date = dateAsDate
      }

      const updatedMatch = await AppDataSource.getRepository(Match).save(match)

      return res.status(200).json(updatedMatch)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.body

    try {
      const match = await AppDataSource.getRepository(Match).findOneBy({ id })

      if (!match) return res.status(404).json('Partida não encontrada')

      await AppDataSource.getRepository(Match).delete(match)

      return res.status(200).json(`Partida ${match.id} deletada!`)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }
}

export default new MatchesController();