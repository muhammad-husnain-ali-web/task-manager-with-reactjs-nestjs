import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Role } from '../enum/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @Column({ type: 'varchar', nullable: true })
    profilePic: string;

    @Column({ type: 'varchar', nullable: true })
    cloudinaryId: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({ type: 'boolean', default: true })
    twoFactorEnabled: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
