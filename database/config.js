const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'})

const dbConnection = async(env) => {

  try {
    await mongoose.connect(env === 'development' ? process.env.DATABASE_LOCAL : process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    console.log(`Database online en ${env}`)
  } catch(err){
    console.log(err)
    throw new Error('Error connecting to the database');
  }

}

module.exports = {
  dbConnection
}