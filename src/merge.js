import { readFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'

import { pinyinId } from './common.js'

const cwd = process.cwd()

const videosDir = join(cwd, 'videos')

const videoList = await readdir(videosDir)

const videos = await Promise.all(videoList.filter(file => file.endsWith('.json')).map(async file => JSON.parse(await readFile(join(videosDir, file)))))

const sum = videos
  .map(({ video: { cover, title, id }, twelveFirst, twelveSecond }) => {
    const key = [...twelveFirst.map(pinyinId).sort(), ',', ...twelveSecond.map(pinyinId).sort()].join('')
    return { key, video: { cover, title, id } }
  })
  .reduce((acc, { key, video }) => {
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(video)
    return acc
  }, {})

writeFile('list.json', JSON.stringify(sum))
