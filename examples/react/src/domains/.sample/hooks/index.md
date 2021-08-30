If domain has view level reusable logic it should be stored as the react hook inside `hooks` folder.

For example:

```typescript
type UseExampleInterface = {
  loading: boolean
  email: string
  handleEmail: (event: React.FormEvent<HTMLInputElement>) => void
}

function useExample(router: RouterInterface): useExample {
  const loading = useStore(exampleEffects.example.pending)
  const [email, setEmail] = useState<string>('')

  const handleEmail = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setEmail(event.target.value)
      }
    },
    [setEmail],
  )

  return {
    loading,
    email,
    handleEmail,
  }
}

export { useExample }
```
