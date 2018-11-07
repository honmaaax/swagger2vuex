import fs from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'

import { generateCode } from '../src/generate'

describe('generateCode', ()=>{
  it('returns a string as JavaScript code', () => {
    const actionParams = [{
      actionName: 'getV2Users',
      args: 'context, query',
      hasBody: false,
      hasPathParams: false,
      hasQuery: true,
      method: 'get',
      mutationType: 'GET_V2_USERS',
      options: '{params: query}',
      url: '/v2/users',
    }]
    const results = generateCode(actionParams)
    expect(results).toBe(
`export const types = [
  'GET_V2_USERS',
].reduce(function(obj, val){ return Object.assign(obj, {[val]: val}) }, {})

export let ajax = {}
export function init (a) { ajax = a }

export function getV2Users (context, query) {
  return ajax.get(\`/v2/users\`, {params: query})
    .then(function(res){
      context.commit(types.GET_V2_USERS, res.data)
      return res.data
    })
}`
    )
  })
})
