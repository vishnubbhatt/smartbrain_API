const handleRegister = (request, response, postgres, bcrypt) => {
    const {email, name, password} = request.body
    if(!email || !password || !name){
        return response.status(400).json('incorrect form submission.')
    }

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
}


export default handleRegister;