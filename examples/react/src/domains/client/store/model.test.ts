import { ClientModel } from './model'

describe('client/store/model', function () {
  describe('constructor', function () {
    it('creates with nulls if nothing was passed', () => {
      expect(new ClientModel({})).toEqual({
        email: null,
        firstName: null,
        lastName: null,
        fullName: null,
      })
    })

    it('takes only valid email addresses', function () {
      expect(new ClientModel({ email: 'foo' })).toEqual({
        email: null,
        firstName: null,
        lastName: null,
        fullName: null,
      })

      expect(new ClientModel({ email: 'foo@bar' })).toEqual({
        email: 'foo@bar',
        firstName: null,
        lastName: null,
        fullName: null,
      })
    })

    it('capitalizes names and joins full name', function () {
      expect(new ClientModel({ firstName: 'foo', lastName: 'BAR' })).toEqual({
        email: null,
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar',
      })
    })
  })

  describe('isFetched', function () {
    it('returns false if there is no email', function () {
      expect(new ClientModel({}).isFetched()).toBe(false)
    })

    it('returns true if there is an email', function () {
      expect(new ClientModel({ email: 'foo@bar' }).isFetched()).toBe(true)
    })
  })
})
