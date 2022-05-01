const { ISSUE_NUMBER, GITHUB_TOKEN } = process.env

const log = w => {
  console.log(w)
  return w
}

fetch(log(`https://api.github.com/repos/Cat-catcat/fuzzy/issues/${ISSUE_NUMBER}`), {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
  body: JSON.stringify({
    state: 'closed'
  })
})
