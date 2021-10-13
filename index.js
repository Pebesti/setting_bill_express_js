let express = require('express');

const exphbs  = require('express-handlebars');

let app = express();

const settings_bill = require('./settings-bill');
const bodyParser = require('body-parser');

const settings = settings_bill();

//Configure the express-handlebars module
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));
app.get("/", function(req, res){
     res.render("index",{
       settings_bill: settings.getSettings(),
      totals: settings.totals(),
      warning: settings.hasReachedWarningLevel(),
      criticalLevel: settings.hasReachedCriticalLevel()
      });
   });
app.post("/settings", function(req, res){
    
settings.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    criticalLevel: req.body.criticalLevel,
    warningLevel:req.body.warningLevel
});

res.redirect('/');

});

app.post("/action", function(req, res){
   settings.recordAction(req.body.billItemType);
   res.redirect('/');
  });

app.get("/actions", function(req, res){
    res.render('actions',{actions: settings.actions()})
   });  

app.get("/actions/:billItemType", function(req, res){
  const billItemType= req.params.billItemType;
  //console.log("Hello");
  res.render('actions',{actions: settings.actionsFor(billItemType)})
   });
let PORT = process.env.PORT || 3009;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});