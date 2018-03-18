const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let items = [];
let id = 0;

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = { id:id, text:req.body.text, expired: req.body.expired, expDate: req.body.expDate };
  items.push(item);
  res.send(item);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let pantry = items.map(item => { return item.id; });
  let index = pantry.indexOf(id);
  let item = items[index];
  item.text = req.body.text;
  item.expired = req.body.expired;
  item.expDate = req.body.expDate;
  if (req.body.orderChange) {
    let indexTarget = pantry.indexOf(req.body.orderTarget);
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(7070, () => console.log('Server listening on port 7070!'));