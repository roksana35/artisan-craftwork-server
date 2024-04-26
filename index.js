const express=require('express');
const cors =require('cors');
require('dotenv').config();

const app = express();
const port=process.env.PORT ||5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('arts and craft server is runing')
})
app.listen(port,()=>{
    console.log(`arts and craft server is runing on port :${port}`)
})