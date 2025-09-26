const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que não haja emails duplicados
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // CRÍTICO: Campo para o número de telefone (formato E.164: +5511999998888)
  phoneNumber: {
    type: String,
    required: true, 
    unique: true,
  },
});

// Middleware PRE-SAVE: Hash da senha antes de salvar no banco
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar a senha digitada com a senha hash
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);