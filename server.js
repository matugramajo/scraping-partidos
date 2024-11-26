const express = require('express');
const mongoose = require('mongoose');
const { Equipo, Partido } = require('./models/Partido');
const { scrapePartidos } = require('./scraper');

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://matildegramajo:OhCQx0CPL9Eb0h7L@argg.joybg.mongodb.net/ARGg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/scrape-partidos', async (req, res) => {
  try {
    const equipos = await Equipo.find(); // Obtener todos los equipos
    const resultados = [];
    const equiposSinPartidos = []; // Lista para equipos sin partidos

    for (const equipo of equipos) {
      const { teamName, logoUrl, equipoUrl, game } = equipo;

      console.log(`Scrapeando datos para el equipo: ${teamName}`);
      const partidos = await scrapePartidos(equipoUrl); // Usamos la función scrapePartidos importada

      if (partidos.length === 0) {
        console.log(`No se encontraron partidos para el equipo: ${teamName}`);
        equiposSinPartidos.push(teamName); // Agregar equipo sin partidos a la lista
        continue; // Pasar al siguiente equipo
      }

      // Guardar los partidos en la base de datos
      for (const partido of partidos) {
        const nuevoPartido = new Partido({
          teamName,
          teamLogoUrl: logoUrl,
          rivalName: partido.rivalName,
          rivalLogoUrl: partido.rivalLogoUrl,
          matchDate: partido.matchDate,
          game,
        });
        await nuevoPartido.save();
        resultados.push(nuevoPartido);
      }
    }

    res.status(200).json({
      message: 'Scrapeo e inserción completados',
      partidosGuardados: resultados.length,
      equiposSinPartidos,
    });
  } catch (error) {
    console.error('Error en el scrapeo:', error);
    res.status(500).json({ error: 'Error durante el proceso' });
  }
});


// Iniciar servidor
app.listen(3002, () => {
  console.log('Servidor corriendo en http://localhost:3002');
});
