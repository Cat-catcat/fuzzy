import { readFile } from 'fs/promises'
import { join } from 'path'

const idNameMap = JSON.parse(await readFile(join(process.cwd(), './src/common/id-name.json')))
const pinyinIdMap = JSON.parse(await readFile(join(process.cwd(), './src/common/pinyin-id.json')))

export const pinyinId = pinyin => pinyinIdMap[pinyin] || pinyin
export const pinyinName = pinyin => idNameMap[pinyinIdMap[pinyin]] || pinyin
