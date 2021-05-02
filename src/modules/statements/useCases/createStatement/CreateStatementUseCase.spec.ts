import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Francis Scott",
      email: "weh@hugnu.gb",
      password: "123456"
    });

    if(!user.id) {
      throw new Error();
    }

    const statement: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 0.50,
      description: "Description test."
    };

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("id");
    expect(createdStatement.type).toEqual("deposit");
  });

  it("should not be able to create a new statement with a non-existing user", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "non_existing_id",
      type: OperationType.DEPOSIT,
      amount: 0.50,
      description: "Description test."
    };

    await expect(
      createStatementUseCase.execute(statement)
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should not be able to create a new statement to user with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "Francis Scott",
      email: "weh@hugnu.gb",
      password: "123456"
    });

    if(!user.id) {
      throw new Error();
    }

    const statement: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 100.50,
      description: "Description test."
    };

    await expect(
      createStatementUseCase.execute(statement)
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
})
