//import { mongo } from 'mongoose';

var mongoose = require('mongoose');

//userModule

var userSchema = new mongoose.Schema({

  name: {
     type: String ,
     unique: true
    },

  phone: {
    unique: true,
    type: String,
    match:/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
},
noOfHajjaj:{
  type:Number
  
},

type: {
    type: String,
    enum: ["ADMIN", "NORMAL"],
    default: "NORMAL"
},

email: {
    type: String,

    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
},

password: { 
    type: String,
     required: true
     },

     familyID:{
        type: String,


     },
     companyId:{
         type:String

     },
     hotelId:{
        type:String

    },
    airPortId:{
        type:String

    },


passportImg: { // url 
    type: String,
    default: "https://icon-icons.com/icons2/582/PNG/512/worker_icon-icons.com_55029.png"
},

VISA:{
type: String,
default: "https://icon-icons.com/icons2/582/PNG/512/worker_icon-icons.com_55029.png"
},

},
  {
    timestamps: true
  });



/******************************************************************************/

//export modules to bd used 

var user = mongoose.model('user', userSchema);


module.exports =
  {
 
    user: user,
    
  };