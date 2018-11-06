import { formatUrlToActionName, formatActionNameToConstant, formatActionNameToCamel } from './format'

export function buildActionParams({ basePath, paths, definitions }) {
  return _.chain(paths)
    .map((spath, url)=>{
      const fullUrl = `${basePath}${url}`
      const pathParams = _.chain(spath.parameters)
        .filter({in: 'path'})
        .map('name')
        .value()
      const hasPathParams = _.size(pathParams)
      return _.map(spath, (details, method)=>{
        if (method === 'parameters') return;
        const { responses, parameters } = details
        const actionName = formatUrlToActionName(fullUrl, method)
        const hasQuery = _.some(parameters, {in: 'query'})
        const hasBody = _.some(parameters, {in: 'body'})
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
          mutationType: formatActionNameToConstant(actionName),
          args: args.join(', '),
          options: _.size(options) ? `{${options.join(', ')}}` : undefined,
        }
      })
    })
    .flatten()
    .compact()
    .value()
}
