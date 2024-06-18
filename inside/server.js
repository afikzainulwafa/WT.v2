const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 1230;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for CSS, JS if needed)
app.use(express.static('public'));

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
