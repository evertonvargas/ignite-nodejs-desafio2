import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { idSchema, mealsBodySchema } from '../schema/mealsSchema'
import { checkSessionIdExist } from '../middlewares/check-session-id-exists'

interface DatabaseProps {
  id: string
  name: string
  description: string
  date: string
  time: string
  isDiet: boolean
  session_id: string
}

const DATABASE: DatabaseProps[] = []

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExist)

  app.get('/', async () => {
    return {
      meals: DATABASE,
    }
  })

  app.get('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)

    const index = DATABASE.findIndex((meal) => meal.id === id)

    if (index !== -1) {
      return reply.send({
        meal: DATABASE[index],
      })
    }

    return reply.status(404).send()
  })

  app.get('/summary', (request, reply) => {
    const { sessionId } = request.cookies
    const meals = DATABASE.filter((meal) => meal.session_id === sessionId)
    const idDiet = meals.filter((meal) => meal.isDiet === true)

    if (meals.length > 0) {
      return reply.send({
        totalMeals: meals.length,
        totalMealsIsDiet: idDiet.length,
        totalOffDietMeals: meals.length - idDiet.length,
      })
    }

    return reply.status(404).send()
  })

  app.post('/', async (request, reply) => {
    const body = mealsBodySchema.parse(request.body)
    const sessionId = request.cookies.sessionId as string

    DATABASE.push({
      id: randomUUID(),
      ...body,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const body = mealsBodySchema.parse(request.body)
    const { id } = idSchema.parse(request.params)

    const index = DATABASE.findIndex((meal) => meal.id === id)

    if (index !== -1) {
      DATABASE[index] = { ...DATABASE[index], id, ...body }
    }

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params)

    const indexToDelete = DATABASE.findIndex((meal) => meal.id === id)

    if (indexToDelete !== -1) {
      DATABASE.splice(indexToDelete, 1)
    }

    return reply.status(204).send()
  })
}
