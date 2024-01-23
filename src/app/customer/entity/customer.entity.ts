import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'customer'})
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    fullname: string;

    createdAt: string;
    updatedAt: string;
    deletedAt: string
}