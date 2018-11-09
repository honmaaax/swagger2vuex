export function generateCode(actionParams) {
  return `export const types = [
${actionParams.map(({ mutationType })=>`  '${mutationType}',`).join('\n')}
].reduce(function(obj, val){ return Object.assign(obj, {[val]: val}) }, {})

export let ajax = {}
export function init (a) { ajax = a }

${actionParams.map(({ method, url, hasQuery, hasBody, actionName, mutationType, args, options })=>(
`export function ${actionName} (${args}) {
  return ajax.${method}(\`${url}\`${hasBody ? ', body' : ''}${options ? `, ${options}` : ''})
    .then(function(res){
      context.commit(types.${mutationType}, res.data)
      return res.data
    })
}`
  )).join('\n')}

export const mutations = {
${actionParams
  .filter(({ stateKey })=>!!stateKey.length)
  .map(({ mutationType, stateKey })=>(
`  [types.${mutationType}]: function (state, payload) {
${stateKey.map(([ pKey, sKey ])=>(`    state.${sKey} = payload${pKey ? `['${pKey}']` : ''}`)).join('\n')}
  },`
    )).join('\n')}
}
`
}
