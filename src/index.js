import program from 'commander'
import fs from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'
import yaml from 'js-yaml'
import Case from 'case'

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
getSwagger(inputFilePath)
  .then((swagger)=>{
    const mutationTypes = generateMutationTypes(swagger.basePath, swagger.paths)
    const actions = generateActionParams(swagger)
    return generateCode(mutationTypes, actions)
  })
  .then((code)=>writeFile(outputFilePath, code))
  .catch((err)=>console.error(err))

function getSwagger(filePath) {
  return Promise.promisify(fs.readFile)(filePath)
    .then((buf)=>buf.toString())
    .then(yaml.safeLoad)
    .then((json)=>_.pick(json, 'paths', 'definitions', 'basePath'))
}

function generateMutationTypes(basePath, paths) {
  return _.chain(paths)
    .map((spath, url)=>{
      return _.map(spath, ({ responses, parameters }, method)=>{
        if (method === 'parameters') return;
        const actionName = formatUrlToActionName(`${basePath}${url}`, method)
        return formatActionNameToConstant(actionName)
      })
    })
    .flatten()
    .compact()
    .value()
}

function formatUrlToActionName(url, method) {
  return _.chain(url.match(/\{(.+?)\}/g))
    .reduce((newUrl, before)=>{
      return newUrl.replace(before, before.replace(/\{(.+?)\}/, 'by/$1'))
    }, url)
    .thru((u)=>`${method}${u}`)
    .split('/')
    .value()
}

function formatActionNameToConstant(actionName) {
  return Case.constant(actionName.join('_'))
}

function formatActionNameToCamel(actionName) {
  return Case.camel(actionName.join('_'))
}

function generateActionParams({ basePath, paths, definitions }) {
  return _.chain(paths)
    .map((spath, url)=>{
      const fullUrl = `${basePath}${url}`
      return _.map(spath, ({ responses, parameters }, method)=>{
        if (method === 'parameters') return;
        const actionName = formatUrlToActionName(fullUrl, method)
        const hasQuery = _.some(parameters, {in: 'query'})
        const args = ['context']
        const options = []
        if (hasQuery) {
          args.push('query')
          options.push('params: query')
        }
        return {
          method,
          url: fullUrl.replace('{', '${'),
          hasQuery,
          actionName: formatActionNameToCamel(actionName),
          args: args.join(', '),
          options: _.size(options) ? `{${options.join(', ')}}` : undefined,
        }
      })
    })
    .flatten()
    .compact()
    .value()
}

function generateCode(mutationTypes, actions) {
  return `import axios from 'axios'

export const types = [
${mutationTypes.map((type)=>`  '${type}',`).join('\n')}
].reduce((obj, val)=>Object.assign(obj, {[val]: val}), {})

${actions.map(({ method, url, hasQuery, actionName, args, options })=>(`export function ${actionName} (${args}) {
  return axios.${method}(\`${url}\`${hasQuery ? ', {params: query}' : ''})
}`)).join('\n')}`
}

function writeFile(outputFilePath, code) {
  fs.writeFileSync(outputFilePath, code)
}
