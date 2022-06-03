class User {
    name;
    age;
    gender;
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}
const predefinedGenders = ["male", "female", "non-binary", "prefer not to say"];
export { User, predefinedGenders };
