
class Validator {
    #errors = new Map()

    validateUsername(username, checker) {
        this.genericValidation(username, checker, "username", "Username")
        return this
    }

    validatePassword(password, checker) {
        this.genericValidation(password, checker, "password", "Password")
        return this
    }

    validateFirstName(firstname, checker) {
        this.genericValidation(firstname, checker, "firstname", "First name")
        return this
    }

    validateLastName(lastname, checker) {
        this.genericValidation(lastname, checker, "lastname", "Last name")
        return this
    }

    validateEmail(email, checker) {
        this.genericValidation(email, checker, "email", "Email")
        return this
    }

    validatePhone(password, checker) {
        this.genericValidation(password, checker, "phone", "Phone")
        return this
    }

    validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            this.#errors.set("password", "Passwords are not identical")
        }
        return this
    }

    validateBirthDate(dateStart, dateEnd) {
        if (Date.parse(dateStart) > new Date()) {
            this.#errors.set("birthDate", "Wrong date of birth")
        }
        if (dateEnd !== null && Date.parse(dateStart) > Date.parse(dateEnd)) {
            this.#errors.set("birthDate", "Date of birth must be prior to the date of death")
        }
        return this
    }

    validateDeathDate(date) {
        if (Date.parse(date) > new Date()) {
            this.#errors.set("deathDate", "Wrong date of death")
        }
        return this
    }

    validateISBN(isbn, checker) {
        this.genericValidation(isbn, checker, "isbn", "ISBN")
        return this
    }

    validateTitle(title, checker) {
        this.genericValidation(title, checker, "title", "Title")
        return this
    }

    validatePublished(published) {
        if (Date.parse(published) > new Date()) {
            this.#errors.set("published", "Wrong date of release")
        }
        return this
    }

    genericValidation(toCheck, checker, key, name) {
        if (!checker.check(toCheck)) {
            this.#errors.set(key, `${name} ${checker.error()}`)
        }
    }

    validate() {
        return this.#errors
    }
}

class ValidatorStarter {
    begin() {
        return new Validator()
    }
}

let validator = new ValidatorStarter();
export default validator




