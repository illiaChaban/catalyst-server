let readBody = request => {
  return (
    new Promise(resolve => {
      let body = '';
      request.on('data', chunk => {
        body += chunk.toString();
      });
      request.on('end', () => {
        resolve(body);
      });
    })
  )

}


module.exports = readBody;