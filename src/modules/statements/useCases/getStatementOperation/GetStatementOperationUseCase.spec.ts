import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Alex Myers",
      email: "nosewur@tes.sk",
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

    if(!createdStatement.id) {
      throw new Error();
    }

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: createdStatement.id
    });

    expect(result).toHaveProperty("id");
    expect(result.id).toEqual(createdStatement.id);
    expect(result.user_id).toEqual(user.id);
  });

  it("should not be able to get a statement operation of non-existing user", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "fake_id",
        statement_id: "fake_id"
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });
})
