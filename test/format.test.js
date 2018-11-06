import fs from 'fs'
import Promise from 'bluebird'
import _ from 'lodash'

import {
  formatUrlToActionName,
  formatActionNameToConstant,
  formatActionNameToCamel,
} from '../src/format'

describe('formatUrlToActionName', ()=>{
  it('returns an array that includes strings', () => {
    const results = formatUrlToActionName('/hoge/fuga', 'get')
    expect(results).toEqual(['get', 'hoge', 'fuga'])
  })
  it('adds "by" when include path params', () => {
    const results = formatUrlToActionName('/hoge/fuga/{id}', 'get')
    expect(results).toEqual(['get', 'hoge', 'fuga', 'by', 'id'])
  })
  it('adds correctly when include path params in the center', () => {
    const results = formatUrlToActionName('/hoge/{id}/fuga', 'get')
    expect(results).toEqual(['get', 'hoge', 'by', 'id', 'fuga'])
  })
})

describe('formatActionNameToConstant', ()=>{
  it('returns a upper case string', () => {
    const results = formatActionNameToConstant(['get', 'hoge', 'fuga'])
    expect(results).toBe('GET_HOGE_FUGA')
  })
})

describe('formatActionNameToCamel', ()=>{
  it('returns a camel case string', () => {
    const results = formatActionNameToCamel(['get', 'hoge', 'fuga'])
    expect(results).toBe('getHogeFuga')
  })
})
