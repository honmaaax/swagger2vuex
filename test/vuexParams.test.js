import fs from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'

import {
  buildVuexParams,
} from '../src/vuexParams'

describe('buildVuexParams', ()=>{
  it('returns an array that includes objects', () => {
    return Promise.promisify(fs.readFile)('./test/assets/swagger.json', 'utf-8')
      .then(JSON.parse)
      .then((swagger)=>{
        const results = buildVuexParams(swagger)
        expect(_.isArray(results)).toBeTruthy()
        expect(_.isPlainObject(results[0])).toBeTruthy()
        expect(_.has(results[0], 'actionName')).toBeTruthy()
        expect(_.has(results[0], 'args')).toBeTruthy()
        expect(_.has(results[0], 'hasBody')).toBeTruthy()
        expect(_.has(results[0], 'hasPathParams')).toBeTruthy()
        expect(_.has(results[0], 'hasQuery')).toBeTruthy()
        expect(_.has(results[0], 'method')).toBeTruthy()
        expect(_.has(results[0], 'mutationType')).toBeTruthy()
        expect(_.has(results[0], 'stateKey')).toBeTruthy()
        expect(_.has(results[0], 'options')).toBeTruthy()
        expect(_.has(results[0], 'url')).toBeTruthy()
        expect(results[0].actionName).toBe('getV2Users')
        expect(results[0].args).toBe('context, query')
        expect(results[0].hasBody).toBe(false)
        expect(results[0].hasPathParams).toBe(false)
        expect(results[0].hasQuery).toBe(true)
        expect(results[0].method).toBe('get')
        expect(results[0].mutationType).toBe('GET_V2_USERS')
        expect(results[0].stateKey).toEqual([['data', 'users']])
        expect(results[0].options).toBe('{params: query}')
        expect(results[0].url).toBe('/v2/users')
      })
  })
})
