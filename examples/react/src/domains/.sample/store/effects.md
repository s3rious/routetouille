`store/effects` is a place to store [effects](https://effector.dev/docs/glossary#effect), a function that does a side effect which can mutate a store or used as the superset of effects.

In `redux`'es terms the closest analog is an `action`, or a `saga`.

For example:

```typescript
import { GET, POST } from 'services/api'

type CreateExampleResponse = {
  foo: string
  bar: string
}

async function createExample(foo: string, bar: string): Promise<CreateExampleResponse> {
  const data = { foo, bar }
  
  return POST('example/', data)
}

export { createExample }
```
