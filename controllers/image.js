import Clarifai from 'clarifai'

const app = new Clarifai.App({
    apiKey: '5061753e90d84c6dbcad56040f4d0b01'
  })  

const handleApiCall = (request, response) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL,request.body.input )
    .then( data => { response.json(data)})
    .catch(err => response.status(400).json('unable to work with API'))
}

const handleImage = (request, response, postgres) => {
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
}

export {handleImage, handleApiCall}