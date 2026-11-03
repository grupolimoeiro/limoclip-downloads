// Junta as partes de cada instalador do LimoClip (o GitHub não aceita arquivos > 100 MB)
// e gera a pasta dist/ que a Vercel publica. Mesmo esquema do limoshot-downloads.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const SHA = {
  'LimoClip-1.0.0-mac-arm64.dmg': '7ed23ccd4f91b1fafa000c1b8a94d9d9fabd3692d62a22165246b2b617f2fe88',
  'LimoClip-1.0.0-win-x64.exe': '974add9d7b0de92670cfa0ae4372311846b9d2b7cb1d27cdde5b21bded269221',
}

fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist')
const partes = fs.readdirSync('parts').sort()
for (const nome of Object.keys(SHA)) {
  const minhas = partes.filter((p) => p.startsWith(nome + '.part'))
  if (!minhas.length) throw new Error('Sem partes para ' + nome)
  const buf = Buffer.concat(minhas.map((p) => fs.readFileSync(path.join('parts', p))))
  const h = crypto.createHash('sha256').update(buf).digest('hex')
  if (h !== SHA[nome]) throw new Error('Checksum errado para ' + nome)
  fs.writeFileSync(path.join('dist', nome), buf)
  console.log('ok', nome, buf.length)
}
fs.writeFileSync('dist/index.html', '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=https://space.grupolimoeiro.com.br/limoclip"><title>LimoClip</title>')
