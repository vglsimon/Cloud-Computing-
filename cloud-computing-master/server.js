// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');
const BooksModel = require("./models/books");

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      // TODO: Write other API end-points description here like above
      {method: 'POST', path: '/api/books/', description: 'Add a book information into database'},
      {method: 'PUT', path: '/api/books/:id', description: 'Update a book information based upon the specified ID'},
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Jon Snow',
    'homeCountry': 'The North',
    'degreeProgram': 'CSE',//informatics or CSE.. etc
    'email': 'jonsnow@northofthewall.com',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Heaven',
    'hobbies': ['being badass', 'killing the bad guys']

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', async (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  /*
   * return the new book information object as json
   */
  var newBook = new BooksModel({
    title: req.body.title, // title of the book
    author: req.body.author, // name of the first author
    releaseDate: req.body.releaseDate, // release date of the book
    genre: req.body.genre, //like fiction or non fiction
    rating: req.body.rating, // rating if you have read it out of 5
    language: req.body.language // language in which the book is released
  });

  console.log(newBook);

  await newBook.save(function (err) {
    if (err)
      return handleError(err);
    // saved!
    console.log('Saved new Book in DB');
  });

  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON object
   */
  var updatedBookInfo = await BooksModel.findByIdAndUpdate(bookId,
    {
      title: req.body.title,
      author: req.body.author,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre,
      rating: req.body.rating,
      language: req.body.language
    }, {new: true, useFindAndModify: false}, function (err) {
      if (err)
        handleError(err);
      console.log('Updated Book in DB');
    });

  res.json(updatedBookInfo._update);
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */
  var deletedBook = (await BooksModel.findById(bookId)).toObject()
  await BooksModel.deleteOne({_id: bookId});
  console.log(deletedBook);
  res.json(deletedBook);
});

handleError = (err) => {
  console.log(err);
}


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
