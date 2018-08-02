module.exports=function ConnectMongoDB(){
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://soo:hajjsoo123@ds111012.mlab.com:11012/hajj')
}

