const express = require('express')
const app = express()
const port = 8000
app.use(express.json())
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));
   const { Schema } = mongoose;

  const userSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    password: String,
    phoneNumber: String,
    isVip: Boolean
  });

  const User = mongoose.model('User', userSchema);


  app.post('/register', async (req, res) => {
  //step 1: check if user with the same phone number already exists
  const userExists  = await User.exists({ phoneNumber: req.body.phoneNumber });
  if(userExists){
    return res.status(400).send('Phone number already registered');
  }
  //step 2: hash the password
  req.body.password = await bcrypt.hash(req.body.password, 10);
  //step 3: create the user
  await User.create(req.body)
  res.send('users created')
})
app.post('/login', async (req, res) => {
  //step 1: check if user with the same phone number already exists
  const user  = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if(!user){
    return res.status(400).send('Phone number does not exist');
  }
  //step 2: check if password matches
  const isMatched =  await bcrypt.compare(req.body.password, user.password);
  if(!isMatched){
    return res.status(400).send('Password is invalid');
  }
  //step 3: send success response
  res.send('Login successful')
})

app.get('/user', async(req, res) => {
 const data = await User.find()
  res.send(data)

});



app.put('/users/:id', async (req, res) => {
  const data = await User.findByIdAndUpdate(req.params.id, req.body)
  res.send('userd updated')
})



app.delete('/users/:id', async (req, res) => {
  const data = await User.findByIdAndDelete(req.params.id)
  res.send('userd deleted')
})



app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})