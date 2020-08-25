import _ from 'lodash'

import { formatUrlToActionName, formatActionNameToConstant, formatActionNameToCamel } from './format'

export function buildVuexParams({ basePath, paths, definitions }) {
  return _.chain(paths)
    .map((spath, url)=>{
      const fullUrl = basePath && basePath !== '/' ? `${basePath}${url}` : url
      const pathParams = _.chain(spath.parameters)
        .filter({in: 'path'})
        .map('name')
        .value()
      const hasPathParams = !!_.size(pathParams)
      return _.map(spath, (api, method)=>{
        if (method === 'parameters') return;
        const { responses, parameters } = api
        const xVuexKey = api['x-vuex-key']
        const actionName = formatUrlToActionName(fullUrl, method)
        const hasQuery = _.some(parameters, {in: 'query'})
        const hasBody = _.some(parameters, {in: 'body'})
        const stateKey = _.isString(xVuexKey) ? [[xVuexKey]] :
          _.isPlainObject(xVuexKey) ? _.toPairs(xVuexKey) : []
        const args = ['context']
        const options = []
        if (hasPathParams) {
          args.push(pathParams)
        }
        if (hasQuery) {
          args.push('query')
          options.push('params: query')
        }
        if (hasBody) {
          args.push('body')
        }
        return {
          method,
          url: fullUrl.replace('{', '${'),
          hasPathParams,
          hasQuery,
          hasBody,
          actionName: formatActionNameToCamel(actionName),
          //mutationType: formatActionNameToConstant(actionName),
          mutationType: formatActionToMutationSet(actionName),
          stateKey,
          args: args.join(', '),
          options: _.size(options) ? `{${options.join(', ')}}` : undefined,
        }
      })
    })
    .flatten()
    .compact()
    .value()
}
