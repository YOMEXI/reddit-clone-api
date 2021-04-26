import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";

import { classToPlain, Exclude } from "class-transformer";

export default abstract class SimilarEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
