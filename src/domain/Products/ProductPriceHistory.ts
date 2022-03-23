import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {JoinColumn} from "typeorm";
import {Products} from "./Products";

@Entity("product_price_history")
export class ProductPriceHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Products)
    @JoinColumn({name:"product_id"})
    product: Products;

    @Column()
    product_id: number;

    @Column()
    price: number;

    @Column({
        name: "valid_until",
        type: "date"
    })
    validUntil: Date;

}