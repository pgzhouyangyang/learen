var express=require("express");
var app=express();
app.get("*",function(req,res){
    console.log(req.path);
    res.sendFile(__dirname+req.path);
})
app.listen(8888,function(){
    console.log("success");
});
