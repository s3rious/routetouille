import {
  isSlug,
  type Slug,
  WithSlug,
  type WithSlugInterface,
  type WithSlugOptions,
} from "./WithSlug/index.js";
import {
  isSearch,
  type Search,
  WithSearch,
  type WithSearchInterface,
  type WithSearchOptions,
} from "./WithSearch/index.js";
import {
  isHash,
  type Hash,
  WithHash,
  type WithHashInterface,
  type WithHashOptions,
} from "./WithHash/index.js";

type Path = Slug | Search | Hash;

type WithPathOptions = WithSlugOptions | WithSearchOptions | WithHashOptions;

type WithPathInterface =
  | WithSlugInterface
  | WithSearchInterface
  | WithHashInterface;

function WithPath<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return (
    options: WithPathOptions & ComposedOptions,
  ): WithPathInterface & ComposedInterface => {
    if (isSlug(options.path)) {
      const slugOptions = options as WithSlugOptions & ComposedOptions;
      return WithSlug(createRoute)(slugOptions);
    }

    if (isSearch(options.path)) {
      const searchOptions = options as WithSearchOptions & ComposedOptions;
      return WithSearch(createRoute)(searchOptions);
    }

    if (isHash(options.path)) {
      const hashOptions = options as WithHashOptions & ComposedOptions;
      return WithHash(createRoute)(hashOptions);
    }

    throw new Error("Not a valid `path`");
  };
}

export { WithPath, type WithPathOptions, type WithPathInterface, type Path };
