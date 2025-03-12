const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    
    try {
        const token =  req.session.authorization
        if (!token) {
            return res.status(403).json({message: "Forbidden"});
        }
        jwt.verify(token.accessToken, "fingerprint_customer", (err,decoded)=>{
            if (err) {
                return res.status(403).json({message: "Forbidden"});
            }
            req.user = decoded;
            next();
        }); 
    } catch (error) {
        console.log(error);
        
    }
});
 
const PORT =5000;

app.use("/api",genl_routes);
app.use("/customer", customer_routes);

app.listen(PORT,()=>console.log(`Server is running at http://localhost:${PORT}/`));
 