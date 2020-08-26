import _ from 'lodash'
import Case from 'case'

export function formatUrlToActionName(url, method, keepMethod) {
  const urlAfterMatch = url.match(/\{(.+?)\}/g)
  return _.chain(urlAfterMatch)
    .reduce((newUrl, before)=>{
      return newUrl.replace(before, before.replace(/\{(.+?)\}/, 'by/$1'))
    }, url)
      .thru((u) => 
          `${keepMethod ? method : ''}${u}` // crap
      )
    .split('/')
    .value()
}

export function formatActionNameToConstant(actionName) {
  return Case.constant(actionName.join('_'))
}

export function formatActionToMutationSet(entityName) {
  return {
      root: `${formatActionNameToCamel(entityName)}`,
      setEntity: `${formatActionNameToCamel(entityName)}.byId.*`,
      setEntityIsLoading: `${formatActionNameToCamel(entityName)}.isLoading`,
      setEntityAPIError: `${formatActionNameToCamel(entityName)}.apiErrorMessage`,
  }
}

export function formatActionNameToCamel(actionName) {
  return Case.camel(actionName.join('_'))
}
