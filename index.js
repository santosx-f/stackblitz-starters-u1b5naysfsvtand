const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const produtosRoutes = require('./routes/produtosRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/produtos', produtosRoutes);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
