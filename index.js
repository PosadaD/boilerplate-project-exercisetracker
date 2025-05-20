const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { format } = require('date-fns');

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
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    type: String
  },
  date: {
    type: Date, 
    requied: true
  },
}


const logSchema = {
    username: {
      type: String,
    },
    count: {
      type: Number
    },
    user_id: {
      type: String,
      required: true
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


exerciseSchema.col


const user = mongoose.model("user", userSchema);
const exercise = mongoose.model("exercise", exerciseSchema);
const log = mongoose.model("log", logSchema);


//endpoint para agregar usuarios
app.post("/api/users",(async(req, res)=>{ 
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
}))


//endpoint para obtener usuarios
app.get("/api/users", (async(req, res)=>{ 
  //consultar usuarios
  const users = await user.find()
  //responder usuarios
  res.json(users);
}))


app.post("/api/users/:_id/exercises", async(req, res)=>{
  //revisar si existe el usuario
  const usuario = await user.findById(req.params._id);
  if(usuario){
    try{

      const {description, duration, date} = req.body

      const newExercise = new exercise({
        user_id: usuario._id,
        username: usuario.username,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      })
      //guardar datos
      const added = await newExercise.save()
      if(added) console.log("ejercicio agregado");
      //obtener datos guardados
      res.json({
        _id: added.user_id,
        username: added.username,
        description: added.description,
        duration: parseInt(added.duration),
        date: new Date(added.date).toDateString(),
      });
    }
    catch(error){
      console.log(error)
    }
  }else{ 
    res.send("no existe ususario")
    return
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
