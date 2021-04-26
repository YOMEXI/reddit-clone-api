import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";

import SimilarEntity from "./SimilarEntity";
import { User } from "./User";
import { makeId, slugify } from "../helpers/utils";
import { Sub } from "./Sub";
import { Comment } from "./Comment";
import { Exclude, Expose } from "class-transformer";
import { Vote } from "./Vote";

@Entity("posts")
export class Post extends SimilarEntity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Column()
  identifier: string; //uuid

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  username: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @BeforeInsert()
  IdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }
}
