const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.POST||3737


// Middle were
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
 res.send("Career Server is Running...")
})

app.listen(port,()=>{
 console.log(`Server Is Running On http://${port}`)
})