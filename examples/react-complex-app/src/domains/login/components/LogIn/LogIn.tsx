import type { ReactElement } from "react";

import type { WithReactComponentProps } from "services/router/routes";

import { useLogIn } from "domains/login/hooks/useLogIn";

import { Card } from "components/atoms/Card/Card";
import { Input } from "components/atoms/Input";
import { Link } from "components/atoms/Link";
import { Preloader } from "components/atoms/Preloader";
import { Relative } from "components/atoms/Relative";
import { Spacing } from "components/atoms/Spacing";
import { Stack } from "components/atoms/Stack";
import { Typography } from "components/atoms/Typography";
import { RegularButton } from "components/molecules/RegularButton";
import { Toast } from "components/molecules/Toast";

function LogIn({ router }: WithReactComponentProps): ReactElement {
  const lastActiveRouteName: string | null =
    router.active[router.active.length - 1].name ?? null;
  const {
    loading,
    email,
    password,
    disabled,
    handleEmail,
    handlePassword,
    handleLogin,
  } = useLogIn(router);

  return (
    <Relative mix>
      <Card level={3}>
        <Preloader shown={loading} />
        <Spacing vertical={40} horizontal={80}>
          <Typography size={32} align="center">
            Log in
          </Typography>
          <Spacing top={16} mix>
            <form onSubmit={handleLogin}>
              <Stack vertical={24}>
                {lastActiveRouteName === "reset-success" && (
                  <Toast status="success">
                    Password reset instructions sent to your email address
                  </Toast>
                )}
                <label htmlFor="login-email">
                  <Stack vertical={4}>
                    <Typography size={12}>Your email</Typography>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="username"
                      onChange={handleEmail}
                      block
                    >
                      {email}
                    </Input>
                  </Stack>
                </label>
                <label htmlFor="login-password">
                  <Stack vertical={4}>
                    <Typography size={12}>Password</Typography>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      onChange={handlePassword}
                      block
                    >
                      {password}
                    </Input>
                  </Stack>
                </label>
                <Link to="login.forgot-password">
                  <Typography size={12}>Forgot password?</Typography>
                </Link>
                <RegularButton
                  type="submit"
                  disabled={disabled || loading}
                  block
                >
                  {loading ? "Logging in..." : "Log in"}
                </RegularButton>
              </Stack>
            </form>
          </Spacing>
        </Spacing>
      </Card>
    </Relative>
  );
}

export { LogIn };
