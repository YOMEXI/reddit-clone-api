import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import SimilarEntity from "./SimilarEntity";
import { User } from "./User";
import { Post } from "./Post";
import { Expose } from "class-transformer";

@Entity("subs")
export class Sub extends SimilarEntity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Column({ unique: true })
  name: string; //uuid

  @Column()
  title: string;

  @Column({ nullable: true, type: "text" })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  imageUrl_Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose() get imgUrl(): string {
    return this.imageUrl
      ? this.imageUrl
      : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  }
}
