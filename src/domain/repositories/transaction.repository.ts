import { ParticipantType, Transaction } from "../entities/transaction";

export interface ITransactionRepository {
    createTransaction(transaction: Transaction): Promise<Transaction>;
    getTransactionById(id: number): Promise<Transaction | null>;
    getTransactionsByAccountId(id: number, type: ParticipantType): Promise<Transaction[]>;
    cancelTransaction(id: number): Promise<Transaction | null>;
    getLatestTransactions(): Promise<Transaction[]>;
}