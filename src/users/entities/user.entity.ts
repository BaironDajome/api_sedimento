import { Role } from "../../common/enums/rol.enum";
import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true, select: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.CIENTIFICO }) 
    role: Role;

    @DeleteDateColumn()
    deletedAt: Date;

}
