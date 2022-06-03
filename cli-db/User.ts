class User {
  constructor(public name: string, public age: number, public gender: string) {}
}

const predefinedGenders = ["male", "female", "non-binary", "prefer not to say"];

export { User, predefinedGenders };