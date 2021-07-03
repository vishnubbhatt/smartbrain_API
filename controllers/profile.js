const handleProfile = (request, response, postgres) => {
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
}

export default handleProfile;