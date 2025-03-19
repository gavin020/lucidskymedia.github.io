const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    res.json(images);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
