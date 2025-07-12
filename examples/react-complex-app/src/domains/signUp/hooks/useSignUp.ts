import { useUnit } from "effector-react";
import type * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { effects as clientEffects } from "domains/client";
import type { RouterInterface } from "services/router";

type UseSignUpInterface = {
  loading: boolean;
  email: string;
  password: string;
  error: Error | null;
  disabled: boolean;
  handleEmail: (event: React.FormEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSignUp: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

function useSignUp(router: RouterInterface): UseSignUpInterface {
  const loading = useUnit(clientEffects.signUp.pending);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const disabled = useMemo<boolean>(
    () => email.length <= 0 || password.length <= 0,
    [email, password],
  );

  const handleEmail = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setEmail(event.target.value);
      }
    },
    [],
  );

  const handlePassword = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setPassword(event.target.value);
      }
    },
    [],
  );

  const handleSignUp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      try {
        await clientEffects.signUp({ email, password });
        await router.goTo("auth", { optimistic: true });
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      }
    },
    [router, email, password],
  );

  return {
    loading,
    email,
    password,
    error,
    disabled,
    handleEmail,
    handlePassword,
    handleSignUp,
  };
}

export { useSignUp };
