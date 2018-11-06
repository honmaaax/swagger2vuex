import _ from 'lodash'

import { readFile, writeFile } from '../src/file'

describe('readFile', ()=>{
  it('returns Promise', () => {
    expect(_.get(readFile('./test/assets/swagger.yml'), 'then')).toBeTruthy()
    expect(_.isFunction(readFile('./test/assets/swagger.yml').then)).toBeTruthy()
  })
  it('returns params in callback', () => {
    return readFile('./test/assets/swagger.yml')
      .then((results)=>{
        expect(_.has(results, 'paths')).toBeTruthy()
        expect(_.has(results, 'definitions')).toBeTruthy()
        expect(_.has(results, 'basePath')).toBeTruthy()
      })
  })
  it('reads a YAML file', () => {
    return readFile('./test/assets/swagger.yml')
      .then((results)=>{
        expect(_.has(results, 'paths')).toBeTruthy()
        expect(_.has(results, 'definitions')).toBeTruthy()
        expect(_.has(results, 'basePath')).toBeTruthy()
      })
  })
  it('reads a JSON file', () => {
    return readFile('./test/assets/swagger.json')
      .then((results)=>{
        expect(_.has(results, 'paths')).toBeTruthy()
        expect(_.has(results, 'definitions')).toBeTruthy()
        expect(_.has(results, 'basePath')).toBeTruthy()
      })
  })
  it('throws an error when read a file other than YAML and JSON', () => {
    return readFile('./test/assets/invalid_swagger.txt')
      .catch((err)=>{
        expect(_.isError(err)).toBeTruthy()
      })
  })
})

describe('writeFile', ()=>{
  it('returns Promise', () => {
    expect(_.get(writeFile('./test/dist.txt', 'hoge'), 'then')).toBeTruthy()
    expect(_.isFunction(writeFile('./test/dist.txt', 'hoge').then)).toBeTruthy()
  })
})
