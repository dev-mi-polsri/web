import * as crypto from 'node:crypto'

async function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey.toString('hex'))
    })
  })
}

export async function generatePasswordHash(password: string): Promise<{ salt: string; hash: string }> {
  const salt = await generateSalt()
  const hash = await hashPassword(password, salt)
  return { salt, hash }
}

export async function generateSalt(): Promise<string> {
  return crypto.randomBytes(16).toString('hex')
}

export async function verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password, salt)
  return hashedPassword === hash
}