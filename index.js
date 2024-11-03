import express from 'express';
const app = express();
app.get('', (req, res) => {
    const data = { school: 'MindX technology school' };
    res.send(data);});
app.listen(8080, () => {
    console.log('Server is running!');
});