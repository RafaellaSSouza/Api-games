import { v4 as uuidv4 } from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import Application from '@ioc:Adonis/Core/Application'

export default class GamesController {
    private validationOptions = {
        types: ['image'],
        size: '2mb',
    }
    //Adicionar jogo
    public async store({request, response}: HttpContextContract) {
        const body = request.body()
        const image = request.file('image', this.validationOptions)

        if(image) {
            const imageName = `${uuidv4()}.${image!.extname}`
            await image.move(Application.tmpPath('uploads'),{
               name: imageName
            }) 
            body.image = imageName
        }

        const game = await Game.create(body)
        response.status(201)

        return {
            message: 'Jogo adicionado com sucesso!',
            data: game,
        }
    }
    // Listagem de todos os jogos
    public async index() {
        const games = await Game.all()
        return {
            data: games,
        }
    }
    //Listagem por id do jogo
    public async show({params}: HttpContextContract) {
        const game = await Game.findOrFail(params.id)
        return{
            data: game,
        }
    }
    //Deletar jogo
    public async destroy({params}: HttpContextContract) {
        const game = await Game.findOrFail(params.id)
        await game.delete()

        return{
            message:"Jogo excluído com sucesso!",
            data: game,
        }
    }
    //Atualizar jogo
    public async update({params, request}: HttpContextContract) {
        const body = request.body()
        const game = await Game.findOrFail(params.id)

        game.titulo = body.titulo
        game.descricao = body.descricao
        game.lancamento = body.lancamento
        game.genero = body.genero
        game.desenvolvedora = body.desenvolvedora

        if(game.image != body.image || !game.image) {
            const image = request.file('image', this.validationOptions)
            
            if(image) {
                const imageName = `${uuidv4()}.${image!.extname}`
                await image.move(Application.tmpPath('uploads'),{
                    name: imageName
                }) 
                game.image = imageName
            }
        }
        
        await game.save()
        return {
            message: "Jogo atualizado com sucesso!",
            data: game,
        }
    }
}
