const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 1235;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', (req, res) => {
  const imeiList = req.body.imei;
  const timeStart1 = req.body.start.replace('T', ' ');
  const timeEnd1 = req.body.end.replace('T', ' ');
  const timeStart = timeStart1 + ':00';
  const timeEnd = timeEnd1 + ':00';

  // Ensure imeiList is an array
  const imeis = Array.isArray(imeiList) ? imeiList.join(',') : imeiList;

  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://amman-gateway.uzzeet.id/device-service/sinarmas/gh5200-log?imei=${imeis}&time_start=${timeStart}&time_end=${timeEnd}`,
      headers: { 
          'Authorization': 'Bearer eyJpZCI6IjM2MWJkYjFmLWRlYjEtNDE1YS05ZjU4LTgyNTg3MDE3NWE3OCIsInVzZXIiOiJzaW5hcm1hcyIsImFsZyI6IkhTMjU2In0.eyJpZCI6IjM2MWJkYjFmLWRlYjEtNDE1YS05ZjU4LTgyNTg3MDE3NWE3OCIsInVzZXIiOiJzaW5hcm1hcyJ9.g7czjUmuk5j_eCE1FHNKGIE1UIithhoT0cHN3rOlICc'
      }
  };

  axios.request(config)
  .then((response) => {
      res.json(response.data);
  })
  .catch((error) => {
      res.status(500).json({ error: error.message || 'Unknown error occurred' });
  });
});



// Endpoint to fetch tracking data
app.get("/api/tracking", (req, res) => {
  const filePath = path.join(__dirname, "data", "tracking.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading tracking data:", err);
      res.status(500).send({ error: "Error reading tracking data" });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    } catch (parseError) {
      console.error("Error parsing tracking data:", parseError);
      res.status(500).send({ error: "Error parsing tracking data" });
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

