import Checker from "@/validators/checkers/Checker";

class PatternChecker extends Checker {
    #pattern

    check(input) {
        return input.match(this.#pattern)
    }

    pattern(p) {
        this.#pattern = p
        return this
    }

    error() {
        return `do not match pattern: ${this.#pattern}`;
    }
}

export default PatternChecker