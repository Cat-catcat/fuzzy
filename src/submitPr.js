import { writeFile } from 'fs/promises'
import { join } from 'path'

import { GitProcess } from 'dugite'
import { decrypt, encrypt } from './crypto.js'

import { userBlock, deviceBlock, ipBlock } from './blocked.js'
import { pinyinName } from './common.js'

const { ISSUE_NUMBER, ISSUE_BODY } = process.env

const branchName = `review-${ISSUE_NUMBER}`

const videosDir = join(process.cwd(), 'videos')

const gitExec = async params => {
  const name = 'Raiden'
  const email = 'github@raidenshogun.net'
  const { stdout, stderr } = await GitProcess.exec(params, process.cwd(), {
    env: {
      GIT_AUTHOR_NAME: name,
      GIT_AUTHOR_EMAIL: email,
      GIT_COMMITTER_NAME: name,
      GIT_COMMITTER_EMAIL: email,
    },
  })
  console.log({ stdout, stderr })
}

const block = ISSUE_BODY.split('-----END BLOCK-----')[0].split('-----BEGIN BLOCK-----')[1]
const object = JSON.parse(block)

const { enc, video, twelveFirst, twelveSecond, timestamp } = object
const { cover, channel, title, id } = video
const { ip, deviceId, userId } = JSON.parse(await decrypt(Buffer.from(enc, 'base64')))

if (userBlock.includes(userId)) {
  console.log('User blocked')
  process.exit(1)
}

if (ipBlock.includes(ip)) {
  console.log('IP blocked')
  process.exit(1)
}

if (deviceBlock.includes(deviceId)) {
  console.log('Device blocked')
  process.exit(1)
}

await gitExec(['branch', branchName])
await gitExec(['checkout', branchName])

const subject = `${twelveFirst.map(pinyinName).join(' ')} | ${twelveSecond.map(pinyinName).join(' ')}`

const text = `
提交时间 ${new Date(timestamp).toLocaleString('zh-CN')}


${title} <https://www.bilibili.com/video/${id}>
${channel}
![](${cover})

ban 设备, 将\`${(await encrypt(deviceId)).toString('base64')}\` 写入 <https://github.com/Cat-catcat/fuzzy/edit/master/blocked/device>

ban IP, 将\`${(await encrypt(ip)).toString('base64')}\` 写入 <https://github.com/Cat-catcat/fuzzy/edit/master/blocked/ip>

ban 用户, 将\`${(await encrypt(userId)).toString('base64')}\` 写入 <https://github.com/Cat-catcat/fuzzy/edit/master/blocked/user>

`

const file = join(videosDir, `${id}.json`)
if (!file.startsWith(videosDir)) {
  console.log('unknow')
  process.exit(1)
}

await writeFile(file, block)

await gitExec(['add', 'videos'])
await gitExec(['commit', '-m', subject, '-m', text, '-m', `issue #${ISSUE_NUMBER}`])
