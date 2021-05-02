import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Birdie Casey",
      email: "ikogif@gimpum.fr",
      password: "12345"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an existing email", async () => {
    await createUserUseCase.execute({
      name: "Inez Spencer",
      email: "mos@so.ml",
      password: "12345"
    });

    await expect(
      createUserUseCase.execute({
        name: "Christian Perry",
        email: "mos@so.ml",
        password: "12345"
      })
    ).rejects.toEqual(new CreateUserError());
  });
})
