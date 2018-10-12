const express = require('express')
const axios = require('axios')

const clientID = '<your client id>'
const clientSecret = '<your client secret>'
const app = express()
/* 
app.get('/oauth/redirect', (req, res) => {
  const requestToken = req.query.code
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    const accessToken = response.data.access_token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  })
})
 */
app.use(express.static('public'))
app.listen(3000, function () {
                console.log('Example app listening on port 3000!')
        }
)