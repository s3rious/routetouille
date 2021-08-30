`store/api` is a place to store calls to the backend for that particular domain.

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
