const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    isDoctor:{
            type:Boolean,
            default:false,
        },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    // socialMedia: {
    //     facebook: String,
    //     twitter: String,
    //     linkedin: String,
    //   },
    seenNotifications:{
        type:Array,
        default:[],
    },
    unseenNotifications:{
        type:Array,
        default:[],
    },
    
},{
    timestamps: true,
});

const userModel= mongoose.model('users', userSchema);
module.exports = userModel;