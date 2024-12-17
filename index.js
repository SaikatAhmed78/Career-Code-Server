require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

const varifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if(!token){
    return res.status(401).send({message: 'Unuthorized Access'})
  }

  // verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'Unuthorized Access'});
    }

    next();

  })


}

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bvy3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Collections
    const jobsCollection = client.db('jobPortal').collection('jobs');
    const applicationCollection = client.db('jobPortal').collection('job_application');

    // Get Jobs API (Filtered by email)
    app.get('/jobs', async (req, res) => {

      try {
        const jobs = await jobsCollection.find().toArray();
        res.send(jobs);
      } catch (error) {
      
        res.status(500).send({ message: 'Failed to fetch jobs', error });
      }
    });
      

    app.get('/my-jobs', async (req, res) => {
    
      try {
        const email = req.query.email;
        const  query = { hr_email: email };
        const jobs = await jobsCollection.find(query).toArray();
        console.log('Jobs fetched:', jobs); 
        res.send(jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send({ message: 'Failed to fetch jobs', error });
      }
    });


    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await jobsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error('Error fetching job by ID:', error);
        res.status(500).send({ message: 'Failed to fetch job', error });
      }
    });

    app.post('/jobs', async (req, res) => {
      const newJob = req.body;

      try {
        const result = await jobsCollection.insertOne(newJob);
        res.send(result);
      } catch (error) {
        console.error('Error adding new job:', error);
        res.status(500).send({ message: 'Failed to add job', error });
      }
    });

    // Submit a Job Application
    app.post('/job-applications', async (req, res) => {
      const application = req.body;

      try {
        const result = await applicationCollection.insertOne(application);

        // Update application count in the jobs collection
        const jobId = application.job_id;
        const query = { _id: new ObjectId(jobId) };
        const job = await jobsCollection.findOne(query);

        const newCount = job.applicationCount ? job.applicationCount + 1 : 1;
        const updateDoc = { $set: { applicationCount: newCount } };

        await jobsCollection.updateOne(query, updateDoc);

        res.send(result);
      } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).send({ message: 'Failed to submit application', error });
      }
    });

    // Get Job Applications by User
    app.get('/job-application', varifyToken, async (req, res) => {
      const email = req.query.email;

      // console.log(req.cookies?.token)

      try {
        const applications = await applicationCollection.find({ applicant_email: email }).toArray();

        // Add job details to each application
        for (const application of applications) {
          const job = await jobsCollection.findOne({ _id: new ObjectId(application.job_id) });
          if (job) {
            application.title = job.title;
            application.company = job.company;
            application.company_logo = job.company_logo;
          }
        }

        res.send(applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send({ message: 'Failed to fetch applications', error });
      }
    });

    // JWT
    app.post('/jwt', async(req, res) =>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'})
     
      res.cookie('token', token, {
        httpOnly: true,
        secure: false
      })
      .send({success: true})
    });

    app.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false
      })
      .send({success: true})
    })

    // Delete a Job Application
    app.delete('/job-application/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const result = await applicationCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).send({ message: 'Failed to delete application', error });
      }
    });

  } finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to the CAREER CODE API');
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
