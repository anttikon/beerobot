const aws = require('aws-sdk')
const ssm = new aws.SSM()

async function getParameters(...parameters) {
  const params = {
    Names: parameters,
    WithDecryption: true
  }

  const response = await ssm.getParameters(params).promise()
  return response.Parameters.reduce((result, parameter) => {
    result[parameter.Name] = parameter.Value
    return result
  }, {})
}

module.exports.getParameters = getParameters
