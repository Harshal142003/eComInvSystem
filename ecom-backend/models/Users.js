import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
         type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true
    },
     password: {
        type: String,
        required: true, 
        trim: true      
    },
   
}, { timestamps: true });

const Users = mongoose.model('Users', usersSchema);

export default Users;