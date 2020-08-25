export function generateCode(actionParams) {
    // A set of import statements needs to be generated that correspond to the
    // correct axios factory function in the generated net io library
    //
    // Method calls on the objects returned by the factories will also need to
    // be generated
    //
    // All of these should be driven by the definitions in the swagger file as
    // provided by the buildVuexParams function
    //
    //
    // There is a single mutation type derived for each entity in the
    // generateVuexArgs function
    //
    // - this needs to be permutated to be a set
    // -- ${mutationType.setEntity}
    // -- ${mutationType.setEntityIsLoading}
    // -- ${mutationType.setEntityAPIError}
    // - this set needs to match the convention of vuex easy access mutation
    //   names as applied to the generated state tree
    //
    //
    // Additional cases:
    // - given one entity, set by id
    // - given N entities, replace all in the tree?
    // - given a request for a filtered set
  return `export const types = [
${actionParams.map(({ mutationType })=>`  '${mutationType}',`).join('\n')}
].reduce(function(obj, val){ return Object.assign(obj, {[val]: val}) }, {})

export let ajax = {}
export function init (a) { ajax = a }

${actionParams.map(({ method, url, hasQuery, hasBody, actionName, mutationType, args, options })=>(
`export function ${actionName} (${args}) {
  context.commit('${mutationType.setEntityIsLoading}', res.data)

  return ajax.${method}(\`${url}\`${hasBody ? ', body' : ''}${options ? `, ${options}` : ''})
    .then(function(res){
      context.commit('${mutationType.setEntity}', res.data)
      return res.data
    })
    .catch(err => {
      context.commit('${mutationType.setEntityAPIError}', err)
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
