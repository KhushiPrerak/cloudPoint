const express= require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const https=require("https");
const app = express();

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  // console.log("sucess");
  const query=req.body.cityName;
  const apiKey= process.env.API_KEY;
  const unit="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q=" + query+ "&appid="+ apiKey+ "&units="+unit;
  https.get(url,function(response){
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp=weatherData.main.temp;  //copy path from json extension
      const weatherDescription = weatherData.weather[0].description;
      const icon=weatherData.weather[0].icon;
      const imageURL= "http://openweathermap.org/img/wn/"+icon+"@2x.png";

      res.render("final",{
        cityName: query,
        temp: temp,
        weatherDescription: weatherDescription,
        imageURL: imageURL
      })
    })
  })
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running successfully!");
});
