export function generateCode(actionParams) {
  return `import axios from 'axios'

export const types = [
${actionParams.map(({ mutationType })=>`  '${mutationType}',`).join('\n')}
].reduce(function(obj, val){ return Object.assign(obj, {[val]: val}) }, {})

${actionParams.map(({ method, url, hasQuery, hasBody, actionName, mutationType, args, options })=>(
`export function ${actionName} (${args}) {
  return axios.${method}(\`${url}\`${hasBody ? ', body' : ''}${options ? `, ${options}` : ''})
    .then(function(res){
      context.commit(types.${mutationType}, res.data)
      return res.data
    })
}`
  )).join('\n')}`
}
