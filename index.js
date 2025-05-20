const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


mongoose.connect(process.env.MONGO_URL);


const userSchema = {
  username:{
    type: String,
    require: true,
    unique: true
  }
}

const exerciseSchema = {
  username: {
    type: String,
    required: true,
    unique: true 
  },
  description: {
    type: String,
  },
  duration: {
    type: String, 
    required: true
  },
  date: {
    type: Date, 
    requied: true
  },
}


const logSchema = {
    username: {
      type: String,
      required: true
    },
    count: {
      type: Number
    },
    log: [{
      description: {
        type: String
      },
      duration: {
        type: Number
      },
      date: {
        type: Date
      },
    }]  
}


const user = mongoose.model("user", userSchema);
const exercise = mongoose.model("exercise", exerciseSchema);
const log = mongoose.model("log", logSchema);


//endpoint para agregar usuarios
app.route("/api/users")
.post(async(req, res)=>{
  req.username = req.body.username
  
  //revisar si existe el usuario registrado 
  let usuario = await user.findOne({username: req.username})

  // agregar el usuario no registrado 
  if(!usuario){
    const nuevoUsuario = new user({
      username: `${req.username}`
    });
    try{
      //agregar usuario y obtener la infomacion
      usuario = await nuevoUsuario.save();
      if(usuario) console.log("Usuario agregado");
    }catch(error){
      console.log(error);
    }
  }

  //responder en json con la informacion del usuario
  res.json(usuario);
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
