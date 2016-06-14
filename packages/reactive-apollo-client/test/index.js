/* @flow */

import assert from 'assert'
import {hello} from '../src'

describe('hello', () => {
  it('should say hello', () => {
    assert.equal(hello(), 'Hello world!')
    assert.equal(hello('bob'), 'Hello bob!')
  })
})
