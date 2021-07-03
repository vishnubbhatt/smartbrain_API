import express, { request, response } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import knex from 'knex'
import handleRegister from './controllers/register.js'
import handleSignin from './controllers/signin.js'
import handleProfile from './controllers/profile.js'
import {handleImage, handleApiCall} from './controllers/image.js'

const postgres = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'vishnubhatt',
      password : '',
      database : 'smart-brain'
    }
  });

postgres.select('*').from('users').then( data => console.log(data))

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('Welcome to smart-brain API')
})

app.post('/signin', (request, response) => { handleSignin(request, response, postgres, bcrypt)})

app.post('/register', (request, response) =>{ handleRegister(request, response, postgres, bcrypt)})

app.get('/profile/:id', (request, response) => { handleProfile(request, response, postgres)})

app.put('/image',(request, response) => { handleImage(request, response, postgres)})
app.post('/imageurl',(request, response) => { handleApiCall(request, response)})

app.listen(3001, () => {
    console.log('App is running on port 3001')
})

/*
/           ---> res = this is working
/signin     ---> POST = success/fail
/register   ---> POST = new user
/profile/:userid ---> GET = user info
/image      ---> PUT = updated user object

 */