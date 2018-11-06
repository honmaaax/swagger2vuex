import fs from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'
import yaml from 'js-yaml'

export function readFile(filePath) {
  return Promise.promisify(fs.readFile)(filePath, 'utf-8')
    .then(yaml.safeLoad)
    .then((result)=>{
      if (!_.isObject(result)) throw new Error('Invalid File')
      return result
    })
}

export function writeFile(outputFilePath, code) {
  return Promise.promisify(fs.writeFile)(outputFilePath, code)
}
