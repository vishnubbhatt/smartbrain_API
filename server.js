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

app.get('/', (request, response) => {
    response.send('Welcome to smart-brain API')
})

app.post('/signin', (request, response) => {
    postgres.select('email', 'hash').from('login')
            .where('email', '=', request.body.email)
            .then( data => {
                const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
                if(isValid){
                    return postgres.select('*').from('users')
                            .where('email', '=', request.body.email)
                            .then(user => {
                                response.json(user[0])
                            })
                            .catch(err => response.status(400).json('unable to get user.'))
                }
                else{
                    response.status(400).json('wrong credentials.')
                }
            })
            .catch(err => response.status(400).json('wrong credentials.'))

})

app.post('/register', (request, response) => {
    const {email, name, password} = request.body

    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    postgres.transaction( trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then( loginEmail => {
            return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        response.json(user[0])
                    })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => response.status(400).json('Email already exists.'))
})

app.get('/profile/:id', (request, response) => {
    const { id } = request.params
    let found = false
    
    postgres.select('*')
            .from('users')
            .where({ id })
            .then(user => {
                if(user.length){
                    response.json(user[0])
                }
                else{
                    response.status(400).json('User not found.')
                }
            }).catch(err => response.status(404).json('no such user'))

    // if(!found){
    //     response.status(404).json('no such user')
    // }

})

app.put('/image', (request, response) => {
    const { id } = request.body
    
    postgres('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then( entries => {
            if(entries.length){
                response.json(entries[0])
            }
            else{
                response.status(400).json('unable to get entries.')
            }
        })
        .catch(err => response.status(400).json('unable to get entries.'))

    // if(!found){
    //     response.status(404).json('no such user')
    // }
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