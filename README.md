# swagger2vuex
JavaScript code generator that can generate Vuex files from a Swagger file.

## Install
`npm i -g swagger2vuex` or `yarn global add swagger2vuex`

## Run
`swagger2vuex <input_file_path> <output_file_path>`

## Example
`swagger2vuex ./docs/swagger.yml ./src/dist.js`

**./docs/swagger.yml**
```
---
swagger: "2.0"
info:
  description: APIs for testing
  title: Test APIs
  version: 1.0.0
consumes:
- application/json
produces:
- application/json
schemes:
- http
- https
basePath: /v2
definitions:
  role:
    type: string
    enum:
      - admin
      - staff
      - visitor
  user:
    type: object
    required:
      - name
    properties:
      id:
        type: integer
        format: int64
        readOnly: true
      name:
        type: string
      age:
        type: integer
        format: int32
paths:
  /users:
    get:
      summary: Find users
      tags:
        - users
      operationId: findUsers
      parameters:
        - name: keyword
          in: query
          type: string
        - name: sort
          in: query
          type: string
          enum: ["+id", "-id"]
        - name: perpage
          in: query
          type: integer
          format: int32
      responses:
        200:
          schema:
            type: object
            properties:
              data:
                type: array
                items:
                  $ref: "#/definitions/users"
              total:
                type: integer
                format: int64
    post:
      summary: Add a user
      tags:
        - users
      operationId: addUser
      parameters:
        - name: body
          in: body
          schema:
            $ref: "#/definitions/user"
      responses:
        201:
          description: Created
          schema:
            $ref: "#/definitions/user"
  /user/{id}:
    parameters:
      - type: integer
        format: int64
        name: id
        in: path
        required: true
    get:
      summary: Get a user by user ID
      tags:
        - users
      operationId: getUser
      responses:
        200:
          schema:
            type: object
            properties:
              data:
                $ref: "#/definitions/user"
    put:
      summary: Update a user by user ID
      tags:
        - users
      operationId: updateUser
      parameters:
        - name: body
          in: body
          schema:
            $ref: "#/definitions/user"
      responses:
        200:
          description: OK
          schema:
            $ref: "#/definitions/user"
    delete:
      summary: Delete a user by user ID
      tags:
        - users
      operationId: deleteUser
      responses:
        204:
          description: Deleted

```

**./src/APIActions.js**
```
export const types = [
  'GET_V2_USERS',
  'POST_V2_USERS',
  'GET_V2_USER_BY_ID',
  'PUT_V2_USER_BY_ID',
  'DELETE_V2_USER_BY_ID',
].reduce(function(obj, val){ return Object.assign(obj, {[val]: val}) }, {})

export let ajax = {}
export function init (a) { ajax = a }

export function getV2Users (context, query) {
  return ajax.get(`/v2/users`, {params: query})
    .then(function(res){
      context.commit(types.GET_V2_USERS, res.data)
      return res.data
    })
}
export function postV2Users (context, body) {
  return ajax.post(`/v2/users`, body)
    .then(function(res){
      context.commit(types.POST_V2_USERS, res.data)
      return res.data
    })
}
export function getV2UserById (context, id) {
  return ajax.get(`/v2/user/${id}`)
    .then(function(res){
      context.commit(types.GET_V2_USER_BY_ID, res.data)
      return res.data
    })
}
export function putV2UserById (context, id, body) {
  return ajax.put(`/v2/user/${id}`, body)
    .then(function(res){
      context.commit(types.PUT_V2_USER_BY_ID, res.data)
      return res.data
    })
}
export function deleteV2UserById (context, id) {
  return ajax.delete(`/v2/user/${id}`)
    .then(function(res){
      context.commit(types.DELETE_V2_USER_BY_ID, res.data)
      return res.data
    })
}
```

**./src/index.js**
```
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as APIActions from './APIActions'

APIActions.init(axios)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {},
  APIActions,
})

```
