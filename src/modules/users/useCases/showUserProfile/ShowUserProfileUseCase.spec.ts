import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user profile", async () => {
    const user: ICreateUserDTO = {
      name: "David Byrd",
      email: "ro@fornalgoh.fj",
      password: "123456"
    };

    const createdUser = await createUserUseCase.execute(user);

    if(!createdUser.id) {
      throw new Error();
    }

    const profile = await showUserProfileUseCase.execute(createdUser.id);

    expect(profile).toEqual(createdUser);
  });

  it("should not be able to show an profile of an non-existent user", async () => {
    await expect(
      showUserProfileUseCase.execute("false_id")
    ).rejects.toEqual(new ShowUserProfileError());
  });
});
