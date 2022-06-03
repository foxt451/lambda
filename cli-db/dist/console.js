import inquirer from "inquirer";
import { User, predefinedGenders } from "./User.js";
const queryUser = async () => {
    const name = (await inquirer.prompt(questions[0]))["name"];
    if (name.trim() === "")
        return null;
    let age;
    do {
        age = (await inquirer.prompt(questions[1]))["age"];
        if (isNaN(age)) {
            console.log("Enter a valid age");
        }
        else {
            break;
        }
    } while (true);
    const gender = (await inquirer.prompt(questions[2]))["gender"];
    return new User(name, age, gender);
};
const askToFind = async () => {
    const confirm = (await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Do you want to find a user by name?",
        },
    ]))["confirm"];
    if (confirm) {
        const name = (await inquirer.prompt([
            {
                type: "input",
                name: "input",
                message: "Enter the user's name",
            },
        ]))["input"];
        return name;
    }
    else {
        return null;
    }
};
const questions = [
    {
        type: "input",
        name: "name",
        message: "Enter user's name (or press ENTER to quit):",
    },
    {
        type: "number",
        name: "age",
        message: "Enter user's age:",
    },
    {
        type: "list",
        name: "gender",
        choices: [...predefinedGenders, "other"],
    },
];
export { queryUser, askToFind };
