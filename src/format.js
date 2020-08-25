import _ from 'lodash'
import Case from 'case'

export function formatUrlToActionName(url, method, keepMethod) {
  return _.chain(url.match(/\{(.+?)\}/g))
    .reduce((newUrl, before)=>{
      return newUrl.replace(before, before.replace(/\{(.+?)\}/, 'by/$1'))
    }, url)
      .thru((u) => 
          `${keepMethod ? method : ''}${u.split('/')[2]}` // crap
      )
    .split('/')
    .value()
}

export function formatActionNameToConstant(actionName) {
  return Case.constant(actionName.join('_'))
}

export function formatActionToMutationSet(actionName) {
  return {
      setEntity: `${formatActionNameToCamel(actionName)}.byId.*`,
      setEntityIsLoading: `${formatActionNameToCamel(actionName)}.isLoading`,
      setEntityAPIError: `${formatActionNameToCamel(actionName)}.apiErrorMessage`,
  }
}

export function formatActionNameToCamel(actionName) {
  return Case.camel(actionName.join('_'))
}
