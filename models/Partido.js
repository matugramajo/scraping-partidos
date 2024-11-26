const mongoose = require('mongoose');

const EquipoSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  game: { type: String, required: true },
  logoUrl: { type: String, required: true },
  equipoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PartidoSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamLogoUrl: { type: String, required: true },
  rivalName: { type: String, required: true },
  rivalLogoUrl: { type: String, required: true },
  matchDate: { type: Date, required: true },
  game: { type: String, required: true },
});

const Equipo = mongoose.model('Equipo', EquipoSchema);
const Partido = mongoose.model('Partido', PartidoSchema);

module.exports = { Equipo, Partido };
