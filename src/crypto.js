import { webcrypto } from 'crypto'

const { subtle } = webcrypto

const { PUBLIC_KEY, PRIVATE_KEY } = process.env

const encryptKey = await subtle.importKey('jwk', JSON.parse(Buffer.from(PUBLIC_KEY, 'base64').toString()), { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }, true, ['encrypt'])
const decryptKey = await subtle.importKey('jwk', JSON.parse(Buffer.from(PRIVATE_KEY, 'base64').toString()), { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }, true, ['decrypt'])

export const encrypt = async data => Buffer.from(await subtle.encrypt({ name: 'RSA-OAEP' }, encryptKey, Buffer.from(data))).toString('base64')
export const decrypt = async buffer => Buffer.from(await subtle.decrypt({ name: 'RSA-OAEP' }, decryptKey, buffer)).toString()
