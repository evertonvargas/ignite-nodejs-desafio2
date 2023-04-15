import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const sessionId = randomUUID()

    reply
      .cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(201)
  })
}
