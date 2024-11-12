const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint
app.get('/api/data', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const start = `${date} 05:40:01`;
  const end = `${date} 23:30:54`;
  const imeis = '350317171460474,350317171466992,350317171462827,350317171466729,350317171467230,350424069964201,350317171455607,350424069963732,350317171466414,350317171473667,350317171467065,350424069957874,350317171466588,350424062657638,350424069963872,350317171463031,350317171470804,350317171475530,350424069957817,350317171473576,350424062482490,350424069963708,350317171474814,350424069964029,350317171475308,350317171468121,350544500636629,350317171468469,350317171475407,350544501851904,350317171460409,350317171450129,350424069963807,350317171466570,350424062650401,350317171460250,350317171466356,350424069957734,350317171431756,350317171462819,350317171451127';
  const url = `https://amman-gateway.uzzeet.id/device-service/sinarmas/gh5200-log?imei=${imeis}&time_start=${start}&time_end=${end}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer eyJpZCI6IjM2MWJkYjFmLWRlYjEtNDE1YS05ZjU4LTgyNTg3MDE3NWE3OCIsInVzZXIiOiJzaW5hcm1hcyIsImFsZyI6IkhTMjU2In0.eyJpZCI6IjM2MWJkYjFmLWRlYjEtNDE1YS05ZjU4LTgyNTg3MDE3NWE3OCIsInVzZXIiOiJzaW5hcm1hcyJ9.g7czjUmuk5j_eCE1FHNKGIE1UIithhoT0cHN3rOlICc'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Fallback route to serve index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
