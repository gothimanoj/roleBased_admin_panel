require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/agencies', require('./routes/agenciesRouter'))
app.use('/api/clients', require('./routes/clientsRouter'))
app.use('/api/hiredeveloper', require('./routes/hireDeveloper'))

app.use('/image',express.static(__dirname+'/image'));


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})






