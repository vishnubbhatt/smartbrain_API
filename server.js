import express from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import knex from 'knex'

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


const database = {
    users: [
        {
            id: "111",
            name: 'john',
            email: 'john@email.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: "112",
            name: 'Sally',
            email: 'Sally@email.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (request, response) => {
    response.send(database.users)
})

app.post('/signin', (request, response) => {
    if(request.body.email === database.users[0].email &&
        request.body.password === database.users[0].password){
            response.json(database.users[0]);
    }
    else{
        response.status('400').json('error logging in!')
    }
})

app.post('/register', (request, response) => {
    const {email, name, password} = request.body

    postgres('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        response.json(user[0])
    })
    .catch(error => response.status(400).json('Email already exists.'))
})

app.get('/profile/:id', (request, response) => {
    const { id } = request.params
    let found = false
    database.users.forEach( user =>{
        if(user.id === id){
            found = true
            return response.json(user)
        }
    })

    if(!found){
        response.status(404).json('no such user')
    }

})

app.put('/image', (request, response) => {
    const { id } = request.body
    let found = false
    database.users.forEach( user =>{
        if(user.id === id){
            found = true
            user.entries++
            return response.json(user.entries)
        }
    })
    if(!found){
        response.status(404).json('no such user')
    }
})

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