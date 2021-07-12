import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransactionServiceDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({
    title,
    type,
    value,
  }: CreateTransactionServiceDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('The type is invalid');
    }
    const { total } = this.transactionsRepository.getBalance();

    if (type == 'outcome' && total < value) {
      throw new Error('Your do not have enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
