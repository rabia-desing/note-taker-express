const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for reviews
app.get('/api/notes', (req, res) => {
    

fs.readFile('./db/db.json', "utf8", function(err, data){
    if(err) throw err;

    var resultArray = JSON.parse(data);

    res.status(200).json(resultArray);
});

});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
    };
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
          
        }
      });
    

    const response = {
      status: 'success'
    };

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in adding new note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
