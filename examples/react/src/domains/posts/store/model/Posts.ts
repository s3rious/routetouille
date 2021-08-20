import { ListOf } from 'services/model'

import { PostModel } from './Post'

class PostsModel extends ListOf(PostModel, (posts) =>
  posts.sort((leftPost: PostModel, rightPost: PostModel) => rightPost.id - leftPost.id),
) {
  getLatest(): PostsModel {
    return new PostsModel(...this.slice(0, 5))
  }
}

export { PostsModel }
