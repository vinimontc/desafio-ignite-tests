import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  });

  it("should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Jennie Myers",
      email: "rac@bafdiske.jm",
      password: "123456"
    });

    if(!user.id) {
      throw new Error();
    }

    const result = await getBalanceUseCase.execute({user_id: user.id});

    expect(result.balance).toEqual(0);
  });

  it("should not be able to get non-existing user balance", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "fake_id"})
    ).rejects.toEqual(new GetBalanceError());
  });
})
