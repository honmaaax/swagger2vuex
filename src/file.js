import fs from 'fs'
import Promise from 'bluebird'
import yaml from 'js-yaml'

export function readFile(filePath) {
  return Promise.promisify(fs.readFile)(filePath)
    .then((buf)=>buf.toString())
    .then(yaml.safeLoad)
    .then((json)=>_.pick(json, 'paths', 'definitions', 'basePath'))
}

export function writeFile(outputFilePath, code) {
  fs.writeFileSync(outputFilePath, code)
}
