const handleSignin = (request, response, postgres, bcrypt) => {
    const { email, password} = request.body
    if(!email || !password){
        return response.status(400).json('incorrect form submission.')
    }
    postgres.select('email', 'hash').from('login')
            .where('email', '=', email)
            .then( data => {
                const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
                if(isValid){
                    return postgres.select('*').from('users')
                            .where('email', '=', email)
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

}

export default handleSignin;