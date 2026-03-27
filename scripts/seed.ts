/**
 * Script para crear el primer usuario administrador.
 * Uso: npx tsx scripts/seed.ts
 *
 * Requiere las variables de entorno:
 *   MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'changeme123'
const ADMIN_NAME  = process.env.ADMIN_NAME || 'Administrador'

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI no está definido')
  process.exit(1)
}

const UserSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  role:     String,
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Conectado a MongoDB')

  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    console.log(`ℹ️   Ya existe un usuario con ${ADMIN_EMAIL}. Nada que hacer.`)
    process.exit(0)
  }

  const hashed = await bcrypt.hash(ADMIN_PASS, 12)
  await User.create({
    name:     ADMIN_NAME,
    email:    ADMIN_EMAIL,
    password: hashed,
    role:     'admin',
  })

  console.log(`✅  Admin creado: ${ADMIN_EMAIL}`)
  console.log(`🔑  Contraseña: ${ADMIN_PASS}`)
  console.log('⚠️   Cambia la contraseña después del primer login.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
