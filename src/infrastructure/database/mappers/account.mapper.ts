import { Account } from "src/domain/entities/account";
import { AccountModel } from "../models/account.model";

export class AccountMapper {
    static toDomain(model: AccountModel): Account {
        const account = new Account(model.IBAN, model.bank.id, model.user.id)
        account.id = model.id;
        account.balance = model.balance;
        account.state = model.state;
        return account;
    }
}