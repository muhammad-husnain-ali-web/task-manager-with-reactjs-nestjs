import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Status } from '../enum/status.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.Pending,
    })
    status: Status;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}