import { useCallback, useMemo, type MouseEventHandler } from "react";
import type { Activator, Params, RouterInterface } from "routetouille";

import { useRouter } from "./useRouter.js";

type UseLinkProps<LinkActivator, LinkParams> = {
  to?: LinkActivator;
  params?: LinkParams;
  optimistic?: boolean;
  saveScrollPosition?: boolean;
  href?: string;
};

type UseLink = {
  href: string | undefined;
  handleClick: MouseEventHandler<HTMLAnchorElement>;
};

function useLink<LinkActivator extends Activator, LinkParams extends Params>({
  to,
  params,
  optimistic,
  saveScrollPosition,
  href: hrefProp,
}: UseLinkProps<LinkActivator, LinkParams>): UseLink {
  const router: RouterInterface | undefined = useRouter();

  const href: string | undefined = useMemo(() => {
    if (to != null && router != null) {
      return router.urlTo(to, params) ?? hrefProp;
    }

    return hrefProp;
  }, [to, params, router, hrefProp]);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (event) => {
      if (to != null && router != null) {
        event.preventDefault();

        if (saveScrollPosition && router.history?.replace) {
          const pathname = `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`;
          router.history.replace(pathname, { scrollTop: globalThis.scrollY });
        }

        await router.goTo(to, { params, optimistic });
      }
    },
    [to, params, optimistic, saveScrollPosition, router],
  );

  return {
    href,
    handleClick,
  };
}

export { useLink };
