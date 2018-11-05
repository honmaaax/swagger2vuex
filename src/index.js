import program from 'commander'
import _ from 'lodash'

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

console.log({
  inputFilePath,
  outputFilePath,
})
