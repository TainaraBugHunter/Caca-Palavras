const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Gerar palavras a partir de texto
app.post('/api/gerar-palavras', (req, res) => {
  const { texto, quantidade } = req.body;
  if (!texto || !quantidade) return res.status(400).send('Texto e quantidade obrigatórios');

  const palavras = Array.from(new Set(
    texto
      .toUpperCase()
      .replace(/[^A-ZÀ-Ú\s]/g, '')
      .split(/\s+/)
      .filter(p => p.length >= 4)
  ));

  palavras.sort(() => 0.5 - Math.random());
  const selecionadas = palavras.slice(0, quantidade);
 
  res.json({ palavras: selecionadas });
});

// Salvar pontuação
app.post('/api/salvar-pontuacao', (req, res) => {
  const { nome, tempo, totalPalavras } = req.body;
  if (!nome || tempo == null || !totalPalavras) return res.status(400).send('Dados incompletos');

  const registro = { nome, tempo, totalPalavras, data: new Date().toISOString() };
  const file = 'scores.json';

  let scores = [];
  if (fs.existsSync(file)) {
    scores = JSON.parse(fs.readFileSync(file));
  }
  scores.push(registro);
  fs.writeFileSync(file, JSON.stringify(scores, null, 2));

  res.send({ sucesso: true, registro });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));