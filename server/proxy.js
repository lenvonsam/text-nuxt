const express = require('express')

const router = express.Router()

const app = express()

const hptl = require('../utils/httpUtil')
// const proxyUrl = 'https://showcase.thinkingsam.cn/syun-backend/api/'
// const proxyUrl = 'http://deploy.thinkingsam.cn/syun-backend-dev/'
// const proxyUrl = 'http://172.16.120.245:7786/'
// const proxyUrl = 'http://172.16.16.193:7786/'
// const proxyUrl = 'http://localhost:9999/v1/'
const proxyUrl = 'http://192.168.80.211:8080/'
// const proxyUrl = 'http://172.16.120.225:7786/'
// const proxyUrl = 'http://192.168.20.170:8080/crmserver/'
// const proxyUrl = 'http://192.168.20.200:8080/crmserver/'
// const proxyUrl = 'http://172.16.120.250:8999/v1/'
// const proxyUrl = 'http://172.16.120.203:9999/v1/'


router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.get('/test', (req, res) => {
  console.log('backend test')
  hptl.httpGet(proxyUrl + '/test').then(
    ({ data }) => {
      res.json(data)
    },
    err => {
      console.log(err)
      res.json({ returnCode: -1, errMsg: '网络异常' })
    }
  )
})

router.post('/test', (req, res) => {
  console.log('test post:' + JSON.stringify(req.body))
  hptl.httpPost(proxyUrl + 'test', { name: '测试' }).then(({ data }) => {
    console.log(data)
    res.json({ returnCode: 0 })
  })
})

router.post('/logout', (req, res) => {
  if (req.session.currentUser) delete req.session.currentUser
  res.json({ returnCode: 0 })
})

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const fs = require('fs')
const rqt = require('request')
const url = require('url')
// ueditor config
// const ueConfig = require('./ueditorConfig.js')

router.get('/hello', (req, res) => {
  res.json({ text: 'hello world' })
})
// router.get('/fileUpload', (req, res) => {
//   console.log(req.url)
//   const url_parts = url.parse(req.url, true)
//   console.log(url_parts)
  // if (url_parts.query.action === 'config') res.json(ueConfig)
  // else res.json({})
// })

router.post('/fileUpload', multipartMiddleware, (req, res) => {
  console.log(req.url)
  const url_parts = url.parse(req.url, true)
  var action = ''
  if (req.body.action) {
    action = req.body.action
  } else {
    action = url_parts.query.action
  }
  // var formData = new FormData()
  // formData.append('action', req.body.action)
  // formData.append('upfile', fs.createReadStream(req.files.upfile.path))
  const formData = {
    action: action,
    upfile: fs.createReadStream(req.files.upfile.path)
  }
  if (req.body.dataType) formData.dataType = req.body.dataType
  if (req.body.sheetIdx) formData.sheetIdx = req.body.sheetIdx
  rqt.post(
    {
      url: proxyUrl + 'file/uedit/upload',
      formData: formData,
      headers: { 'zhdcrm-proxy-token': hptl.proxyToken('zhdcrm') }
    },
    function(err, resp, body) {
      console.log('err:>>', err)
      console.log('body:>>', typeof body)
      fs.unlink(req.files.upfile.path, function(err) {
        if (err) console.error(err)
        else console.log('temp file delete success')
      })
      res.send(body)
    }
  )
})

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  )
}

router.post('/common/post', (req, res) => {
  const body = req.body
  console.log(body)
  hptl.httpPost(proxyUrl + body.url, body.params).then(
    ({ data }) => {
      if (
        (body.url === 'login' ||
          body.url === 'setting/acct/updateProfile' ||
          body.url === 'setting/acct/createOrUpdate') &&
        data.returnCode === 0
      ) {
        let currentUser = data.currentUser
        let originUser = req.session.currentUser
        if (body.url === 'login') {
          currentUser.loginTime = new Date().getTime()
          currentUser.ipAddress = getClientIP(req)
        } else {
          if (currentUser.id === originUser.id)
            currentUser.loginTime = originUser.loginTime
        }
        if (
          body.url !== 'setting/acct/createOrUpdate' ||
          (body.url === 'setting/acct/createOrUpdate' &&
            originUser.id === currentUser.id)
        )
          req.session.currentUser = currentUser
      }
      res.json(data)
    },
    err => {
      console.log(err)
      res.json({ returnCode: -1, errMsg: '网络异常' })
    }
  )
})

router.post('/common/put', (req, res) => {
  const body = req.body
  console.log(body)
  hptl.httpPut(proxyUrl + body.url, body.params).then(
    ({ data }) => {
      res.json(data)
    },
    err => {
      console.log(err)
      res.json({ returnCode: -1, errMsg: '网络异常1' })
    }
  )
})

router.post('/common/get', (req, res) => {
  const body = req.body
  let paramsArr = []
  for (let key in body.params) {
    paramsArr.push(key + '=' + body.params[key])
  }
  const paramsStr = '?' + paramsArr.toString().replace(/,/g, '&')  
  hptl.httpGet(encodeURI(proxyUrl + body.url + paramsStr)).then(
    ({ data }) => {
      res.json(data)
    },
    err => {
      console.log(err)
      resj.json({ returnCode: -1, errMsg: '网络异常2' })
    }
  )
})

router.post('/common/del', (req, res) => {
  const body = req.body
  hptl.httpDelete(proxyUrl + body.url, body.params).then(
    ({ data }) => {
      res.json(data)
    },
    err => {
      console.log(err)
      res.json({ returnCode: -1, errMsg: '网络异常' })
    }
  )
})

module.exports = router
