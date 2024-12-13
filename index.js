require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bvy3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // collections
    const jobsCollection = client.db('jobPortal').collection('jobs');
    const applicationCollection = client.db('jobPortal').collection('job_application');

    app.get('/jobs', async(req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/jobs/:id', async(req, res) => {
      const id = req.params.id;
      const quary = {_id : new ObjectId(id)};
      const result = await jobsCollection.findOne(quary);
      res.send(result);
    });

    // job application api
    app.post('/job-applications', async(req, res) =>{
        const application = req.body;
        const result = await applicationCollection.insertOne(application);
        res.send(result);

    });

    app.post('/jobs', async(req, res) => {
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result)
    })

    app.get('/job-application', async(req, res) => {
      const email = req.query.email;
      const query = {applicant_email: email}; 
      const result = await applicationCollection.find(query).toArray();

      for(const application of result){
        const query1 = {_id: new ObjectId(application.job_id)};
        const job = await jobsCollection.findOne(query1);

        if(job){
          application.title = job.title;
          application.company = job.company;
          application.company_logo = job.company_logo
        }
      }

      res.send(result)
    });

    app.delete('/job-application/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationCollection.deleteOne(query);
      res.send(result);
  });
  



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to the CAREER CODE API');
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
