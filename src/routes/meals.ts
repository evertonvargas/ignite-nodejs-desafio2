import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { idSchema, mealsBodySchema } from '../schema/mealsSchema'
import { checkSessionIdExist } from '../middlewares/check-session-id-exists'
import { knex } from '../database'

type MealsPerDate = { [date: string]: number }

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const meals = await knex('meals')
        .where('session_id', sessionId)
        .select('*')
      return {
        meals,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const { id } = idSchema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { meal }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where({
          session_id: sessionId,
        })
        .orderBy([
          { column: 'date', order: 'desc' },
          { column: 'time', order: 'desc' },
        ])
      const mealsIsDiet = meals.filter((meal) => Boolean(meal.isDiet) === true)

      const mealsPerDate: MealsPerDate = mealsIsDiet.reduce(
        (acc: MealsPerDate, meal) => {
          const date = meal.date
          if (acc[date]) {
            acc[date]++
          } else {
            acc[date] = 1
          }
          return acc
        },
        {},
      )

      const bestSequence = Object.entries(mealsPerDate).reduce((max, curr) => {
        if (curr[1] > max[1]) {
          return curr
        } else {
          return max
        }
      })

      if (meals.length > 0) {
        return reply.send({
          summary: {
            totalMeals: meals.length,
            totalMealsIsDiet: mealsIsDiet.length,
            totalOffDietMeals: meals.length - mealsIsDiet.length,
            bestSequence: {
              date: bestSequence[0],
              total: bestSequence[1],
            },
          },
        })
      }

      return reply.status(404).send()
    },
  )

  app.post('/', async (request, reply) => {
    const body = mealsBodySchema.parse(request.body)
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals')
      .insert({
        id: randomUUID(),
        ...body,
        session_id: sessionId,
      })
      .returning('*')

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const body = mealsBodySchema.parse(request.body)
      const { id } = idSchema.parse(request.params)
      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .update({
          id,
          session_id: sessionId,
          ...body,
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const { id } = idSchema.parse(request.params)
      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
