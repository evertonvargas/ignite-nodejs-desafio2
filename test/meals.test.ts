import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import supertest from 'supertest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    await supertest(app.server)
      .post('/meals')
      .send({
        name: 'Sanduíche',
        description: 'Sanduíche de pão integral com atum',
        date: '1678935600000', // 16/03/2023
        time: '55320000', // 14:22
        isDiet: true,
      })
      .expect(201)
  })

  it('should be possible to list all meals', async () => {
    const createMealResponse = await supertest(app.server).post('/meals').send({
      name: 'Sanduíche',
      description: 'Sanduíche de pão integral com atum',
      date: '1678935600000', // 16/03/2023
      time: '55320000', // 14:22
      isDiet: true,
    })

    const cookie = createMealResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    expect(response.body.meals).toEqual([
      expect.objectContaining({
        name: 'Sanduíche',
        description: 'Sanduíche de pão integral com atum',
        date: 1678935600000,
        time: 55320000,
        isDiet: 1,
      }),
    ])
  })

  it('should be able get a specific meal', async () => {
    const createMealResponse = await supertest(app.server).post('/meals').send({
      name: 'Sanduíche',
      description: 'Sanduíche de pão integral com atum',
      date: '1678935600000', // 16/03/2023
      time: '55320000', // 14:22
      isDiet: true,
    })

    const cookie = createMealResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = response.body.meals[0].id

    const getMealResponse = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Sanduíche',
        description: 'Sanduíche de pão integral com atum',
        date: 1678935600000,
        time: 55320000,
        isDiet: 1,
      }),
    )
  })

  it('should be able delete a specific meal', async () => {
    const createMealResponse = await supertest(app.server).post('/meals').send({
      name: 'Sanduíche',
      description: 'Sanduíche de pão integral com atum',
      date: '1678935600000', // 16/03/2023
      time: '55320000', // 14:22
      isDiet: true,
    })

    const cookie = createMealResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = response.body.meals[0].id

    await supertest(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(204)
  })

  it('should be able update a specific meal', async () => {
    const createMealResponse = await supertest(app.server).post('/meals').send({
      name: 'Sanduíche',
      description: 'Sanduíche de pão integral com atum',
      date: '1678935600000', // 16/03/2023
      time: '55320000', // 14:22
      isDiet: true,
    })

    const cookie = createMealResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = response.body.meals[0].id

    await supertest(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .send({
        name: 'Sanduíche',
        description: 'Sanduíche do McDonald"s',
        date: '1678935600000', // 16/03/2023
        time: '55320000', // 14:22
        isDiet: false,
      })
      .expect(204)
  })

  it('should be able get summary', async () => {
    const createMealResponse = await supertest(app.server).post('/meals').send({
      name: 'Pizza',
      description: 'Pizza de calabresa',
      date: '1678935600000', // 16/03/2023
      time: '55320000', // 14:22
      isDiet: false,
    })

    const cookie = createMealResponse.get('Set-Cookie')

    await supertest(app.server).post('/meals').set('Cookie', cookie).send({
      name: 'Sanduíche',
      description: 'Sanduíche de pão integral com atum',
      date: '1678935600000', // 16/03/2023
      time: '66120000', // 15:22
      isDiet: true,
    })

    await supertest(app.server).post('/meals').set('Cookie', cookie).send({
      name: 'Pizza',
      description: 'Pizza de calabresa',
      date: '1678849200000', // 15/03/2023
      time: '66120000', // 15:22
      isDiet: false,
    })

    const getSummaryResponse = await supertest(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie)

    expect(getSummaryResponse.body.summary).toEqual(
      expect.objectContaining({
        totalMeals: 3,
        totalMealsIsDiet: 1,
        totalOffDietMeals: 2,
        bestSequence: {
          date: '1678935600000',
          total: 1,
        },
      }),
    )
  })
})
