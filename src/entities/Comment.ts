import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import SimilarEntity from "./SimilarEntity";
import { User } from "./User";
import { makeId, slugify } from "../helpers/utils";
import { Sub } from "./Sub";
import { Post } from "./Post";
import { Vote } from "./Vote";
import { Exclude, Expose } from "class-transformer";

@Entity("comments")
export class Comment extends SimilarEntity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Column()
  identifier: string; //uuid

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;
  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  @BeforeInsert()
  IdAndSlug() {
    this.identifier = makeId(7);
  }
}
