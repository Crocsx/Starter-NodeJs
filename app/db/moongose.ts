import mongoose from 'mongoose';

export const setup = () =>{
    mongoose.connect(process.env.MONGODB_URL!,{ useNewUrlParser : true , useCreateIndex : true });
}
  