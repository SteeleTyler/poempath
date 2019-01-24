const bcrypt = require('bcrypt')
const Koa = require('koa')
const app = new Koa()
const { ObjectId } = require('mongodb')
require('../mongo')(app)
module.exports = ({router}) => {

  // Create a new user given username and password
  router.post('/signUp', async (ctx) => {
    // Check to see if username or password are blank
    if(ctx.request.body.username === ''){
      if(ctx.request.body.password === ''){
        ctx.body = {message: 'userNamePasswordBlank'}
        ctx.status = 422
      } else {
        ctx.body = {message: 'usernameBlank'}
        ctx.status = 422
      }
    } else if(ctx.request.body.password === ''){
      ctx.body = {message: 'passwordBlank'}
      ctx.status = 422
    }
    // Check to see if a user exists with given username
    let existingUser = await app.users.findOne({username: ctx.request.body.username})
    // If so, return message and 409 status
    if(existingUser){
      ctx.body = {message: 'usernameTaken'}
      ctx.status = 409
    } else {
      // Use bcrypt to encrypt the password and store it with the new user
      app.users.insertOne({
        username: ctx.request.body.username,
        password: await bcrypt.hash(ctx.request.body.password, 10)
      })
      ctx.body = {message: 'userAdded'}
    }
  })

  // Validate user
  router.post('/validate', async (ctx) => {
    // Check to see if username or password are blank
    if(ctx.request.body.username === ''){
      if(ctx.request.body.password === ''){
        ctx.body = {message: 'userNamePasswordBlank'}
        ctx.status = 422
      } else {
        ctx.body = {message: 'usernameBlank'}
        ctx.status = 422
      }
    } else if(ctx.request.body.password === ''){
      ctx.body = {message: 'passwordBlank'}
      ctx.status = 422
    }
    // Check to see if a user exists with given username
    let existingUser = await app.users.findOne({username: ctx.request.body.username})
    // If not, return message and 404 status
    if(!existingUser){
      ctx.body = {message: 'userNotFound'}
      ctx.status = 404
    } else {
      // Use bcrypt to encrypt incoming password and compare to stored one
      let passwordsMatch = await bcrypt.compare(ctx.request.body.password, existingUser.password)
      if(passwordsMatch){
        ctx.body = {message: 'accessGranted'}
      } else {
        ctx.body = {message: 'incorrectPassword'}
        ctx.status = 422
      }
    }
    console.log(ctx.body)
  })

  // Delete user
  router.delete('/:userID', async (ctx) => {
    let userToDelete = await app.users.findOne({_id: ObjectId(ctx.params.userID)})
    if(!userToDelete){
      ctx.body = 'userNotFound'
      ctx.status = 404
    } else {
      app.users.deleteOne({_id: ObjectId(ctx.params.userID)})
      console.log(`Username: ${userToDelete.username} deleted`)
      ctx.body = `Successfully deleted user ${userToDelete.username}`
    }
  })

  // Return a random user
  router.get('/randomUser', async (ctx) => {
    ctx.body = await app.users.aggregate([{$sample: {size: 1}}])
  })

  // Return all users
  router.get('/allUsers', async (ctx) => {
    ctx.body = await app.users.find()
  })
}