import program from 'commander'
import _ from 'lodash'

import { readFile, writeFile } from './file'
import { buildVuexParams } from './vuexParams'
import { generateCode } from './generate'

program
  .usage('<input_file_path> <output_file_path>')
  .arguments('<input_file_path> <output_file_path>')
  .parse(process.argv)
if (
  !_.isArray(program.args) ||
  _.size(program.args) !== 2
) {
  throw new Error('Undefined file paths')
}
const [ inputFilePath, outputFilePath ] = program.args
readFile(inputFilePath)
  .then(buildVuexParams)
  .then(generateCode)
  .then((code)=>writeFile(outputFilePath, code))
  .then(()=>console.log(`Generated! => ${outputFilePath}`))
  .catch((err)=>console.error(err))
