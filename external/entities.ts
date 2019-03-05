import { AfterCreate, Column, PrimaryKey, DataType as DataTypes, Table, Model } from 'sequelize-typescript';
import {User} from "../entities/types/user";

@Table({
  freezeTableName: true,
  tableName: 'users',
  timestamps: true,
  underscored: true
})
export default class UserEntity extends Model<UserEntity> {
  @Column({
    type: DataTypes.UUID,
    primaryKey: true
  })
  public uuid: string;

  @Column({
    type: DataTypes.STRING
  })
  public account: string;

  @Column({
    type: DataTypes.STRING
  })
  private_key: string;

  @Column({
    type: DataTypes.STRING
  })
  public public_key: string;

  public toUser(): User {
    return {
      uuid: this.uuid,
      account: this.account,
      publicKey: this.public_key,
      privateKey: this.private_key
    };
  }

  public static fromUser(user: User): UserEntity {
    return new UserEntity({
      public_key: user.publicKey,
      private_key: user.privateKey,
      uuid: user.uuid,
      account: user.account,
    })
  }
}

