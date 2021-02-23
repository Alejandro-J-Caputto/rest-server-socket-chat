const express = require('express');
const cors = require('cors')
const AppError = require('../utils/appError');
const fileUpload = require('express-fileupload');
const userRouter = require('../routes/userRoutes');
const authRouter = require('../routes/authRoutes');
const categoriesRouter = require('../routes/categoryRoutes');
const productsRouter = require('../routes/productRoutes');
const searchRouter = require('../routes/searchRoute');
const uploadRouter = require('../routes/uploadsRoutes');

const { dbConnection } = require('../database/config');

class Server {

  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.pathsEndpoints = {
      users:          '/api/v1/users',
      authorization:  '/api/v1/auth',
      categories:     '/api/v1/cafe/categories',
      products:       '/api/v1/cafe/products',
      searchDoc:      '/api/v1/search',
      uploadFile:     '/api/v1/uploads'
    }
    this.conectarDB(process.env.ENVIROMENT_NOW);
    this.middlewares();
    this.routes();
    // this.listen();
    this.errorHandlingMiddleware();
  }
  middlewares() {
    this.app.use(cors())
    this.app.use(express.json())

    this.app.use(express.static('./public'))  
    this.app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath: true
    }));
  }
  routes() {
    console.log('patata')
    this.app.use(this.pathsEndpoints.users, userRouter);
    this.app.use(this.pathsEndpoints.authorization, authRouter);
    this.app.use(this.pathsEndpoints.categories, categoriesRouter);
    this.app.use(this.pathsEndpoints.products, productsRouter);
    this.app.use(this.pathsEndpoints.searchDoc, searchRouter);
    this.app.use(this.pathsEndpoints.uploadFile, uploadRouter)

    this.app.all('*',(req,res,next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    })
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(this.port)
      console.log('Server running on port', this.port)
    })
  }
  async conectarDB(env) {
    await dbConnection(env);
  }
  errorHandlingMiddleware() {
    this.app.use((err, req, res, next) => {
      err.statusCode = err.statusCode || 500;
      err.status = err.status || 'error';
      if(process.env.ENVIROMENT_NOW === 'development') {
        
      
      }
      res.status(err.statusCode).json({
        // err: {...err, [err.message]:err.message},
        status: err.status,
        message: err.message
      })
    })
  }
} 

module.exports = Server
