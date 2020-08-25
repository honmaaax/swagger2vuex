import _ from 'lodash'
import Case from 'case'

export function formatUrlToActionName(url, method) {
  return _.chain(url.match(/\{(.+?)\}/g))
    .reduce((newUrl, before)=>{
      return newUrl.replace(before, before.replace(/\{(.+?)\}/, 'by/$1'))
    }, url)
    .thru((u)=>`${method}${u}`)
    .split('/')
    .value()
}

export function formatActionNameToConstant(actionName) {
  return Case.constant(actionName.join('_'))
}

export function formatActionToMutationSet(actionName) {
  return {
      setEntity: `${actionName}.byId.*`,
      setEntityIsLoading: `${actionName}.isLoading`,
      setEntityAPIError: `${actionName}.apiErrorMessage`,
  }
}

export function formatActionNameToCamel(actionName) {
  return Case.camel(actionName.join('_'))
}
