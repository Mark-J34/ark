const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static('public'));

app.post('/writeToFile', (req, res) => {
    const dinoName = req.body.name;

    // Write to dinoInfo.txt
    fs.writeFileSync('dinoInfo.txt', dinoName, 'utf8');
    
    res.json({ success: true });
});

app.get('/getDinoStats', (req, res) => {
    try {
        const stats = fs.readFileSync('dinoInfo.txt', 'utf8');
        res.json(JSON.parse(stats));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});