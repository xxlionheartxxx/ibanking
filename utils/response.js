module.exports = {
  SendMessaageRes: function(res, message) {
    if (res.statusCode == 403) {
      return res.send({errors:[{errorCode: 403, message: message || 'FORBIDDEN'}]});
    }
    if (res.statusCode == 401) {
      return res.send({errors:[{errorCode: 401, message: message || 'UNAUTHORIZED'}]});
    }
    if (res.statusCode == 400) {
      return res.send({errors:[{errorCode: 400, message: message || 'BAD REQUEST'}]});
    }
    if (res.statusCode == 500) {
      return res.send({errors:[{errorCode: 500, message: message || 'INTERNAL SERVER ERROR'}]});
    }
    if (res.statusCode !== 0) {
      return
    }
  },
  Ok: function(res, data) {
    res.status(200).send({data:data})
  }
}
