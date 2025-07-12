import type { ReactElement } from "react";

import type { WithReactComponentProps } from "services/router/routes";

import { useSignUp } from "domains/signUp/hooks/useSignUp";

import { Card } from "components/atoms/Card/Card";
import { Input } from "components/atoms/Input";
import { Preloader } from "components/atoms/Preloader";
import { Relative } from "components/atoms/Relative";
import { Spacing } from "components/atoms/Spacing";
import { Stack } from "components/atoms/Stack";
import { Typography } from "components/atoms/Typography";
import { RegularButton } from "components/molecules/RegularButton";
import { Toast } from "components/molecules/Toast";

function SignUp({ router }: WithReactComponentProps): ReactElement {
  const {
    loading,
    email,
    password,
    error,
    disabled,
    handleEmail,
    handlePassword,
    handleSignUp,
  } = useSignUp(router);

  return (
    <Relative mix>
      <Preloader shown={loading} />
      <Card level={3}>
        <Spacing vertical={40} horizontal={80}>
          <Typography size={32} align="center">
            Sign up
          </Typography>
          <Spacing top={16} mix>
            <form onSubmit={handleSignUp}>
              <Stack vertical={24}>
                {error?.message && (
                  <Toast status="error">{error?.message}</Toast>
                )}
                <label htmlFor="signup-email">
                  <Stack vertical={4}>
                    <Typography size={12}>Your email</Typography>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="username"
                      onChange={handleEmail}
                      block
                    >
                      {email}
                    </Input>
                  </Stack>
                </label>
                <label htmlFor="signup-password">
                  <Stack vertical={4}>
                    <Typography size={12}>Password</Typography>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="current-password"
                      onChange={handlePassword}
                      block
                    >
                      {password}
                    </Input>
                  </Stack>
                </label>
                <RegularButton
                  type="submit"
                  disabled={disabled || loading}
                  block
                >
                  {loading ? "Signing up..." : "Sign up"}
                </RegularButton>
              </Stack>
            </form>
          </Spacing>
        </Spacing>
      </Card>
    </Relative>
  );
}

export { SignUp };
