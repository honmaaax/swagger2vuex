import program from 'commander'
import _ from 'lodash'

import { readFile, writeFile } from './file'
import { buildActionParams } from './actionParams'
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
  .then(buildActionParams)
  .then(generateCode)
  .then((code)=>writeFile(outputFilePath, code))
  .catch((err)=>console.error(err))
