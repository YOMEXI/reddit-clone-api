import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import SimilarEntity from "./SimilarEntity";
import { Post } from "./Post";
import { Vote } from "./Vote";

@Entity("users")
export class User extends SimilarEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ unique: true })
  @Length(2, 20, { message: "Must be at least 2 characters long" })
  @IsNotEmpty()
  username: string;

  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 45, { message: "Email is Empty" })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  @Length(7, 50, { message: "Must be at least 7 characters long" })
  @IsNotEmpty()
  password: string;

  @Column()
  age: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashpassword() {
    this.password = await bcrypt.hash(this.password, 11);
  }
}
