import fs from 'fs'
import Promise from 'bluebird'
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
    const PATH = './test/dist.txt'
    expect(_.get(writeFile(PATH, 'hoge'), 'then')).toBeTruthy()
    expect(_.isFunction(writeFile(PATH, 'hoge').then)).toBeTruthy()
  })
  it('updates a file', () => {
    const PATH = './test/dist2.txt'
    return Promise.promisify(fs.writeFile)(PATH, 'hoge')
      .then(()=>Promise.promisify(fs.readFile)(PATH, 'utf-8'))
      .then((res)=>{
        expect(res).toBe('hoge')
        return writeFile(PATH, 'fuga')
      })
      .then(()=>Promise.promisify(fs.readFile)(PATH, 'utf-8'))
      .then((res)=>{
        expect(res).toBe('fuga')
      })
  })
})
