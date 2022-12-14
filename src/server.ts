import express, { response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { filter } from 'bluebird';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  
  //Validating the image_url
  app.get("/filteredimage", async (req, res) => {
    let image_url: string = req.query.image_url;

    if (!image_url) {
      res.status(400).send({message: "Image URL not provided!"}); 
      return;
    } else {
        await filterImageFromURL(image_url).then(function (image_filtered_path) {
          res.status(200).sendFile(image_filtered_path, () => {  //send the resulting filtered image file in the response
            deleteLocalFiles([image_filtered_path]);  // deletes any files on the server on finish of the response
          });
        }).catch(function(error) {
          res.status(422).send({message: "Image cannot be filtered! Provided valid Image URL."});
        });
      } 
    });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();