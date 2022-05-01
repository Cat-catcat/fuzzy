import { join } from 'path'
import { readFile } from 'fs/promises'

import { decrypt } from './crypto.js'

const blockedDir = join(process.cwd(), 'blocked')

const decryptLine = string => {
  const ps = string
    .split('\n')
    .map(line => Buffer.from(line, 'base64').toString())
    .map(buffer => decrypt(buffer).catch(() => ''))

  const lines = await Promise.all(ps)
  const result = lines.filter(Boolean)
  console.log(lines.length)
  return result
}

export const deviceBlock = decryptLine((await readFile(join(blockedDir, 'device'))).toString())
export const ipBlock = decryptLine((await readFile(join(blockedDir, 'ip'))).toString())
export const userBlock = decryptLine((await readFile(join(blockedDir, 'user'))).toString())
