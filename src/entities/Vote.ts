import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import SimilarEntity from "./SimilarEntity";
import { User } from "./User";

import { Comment } from "./Comment";

import { Post } from "./Post";

@Entity("votes")
export class Vote extends SimilarEntity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
