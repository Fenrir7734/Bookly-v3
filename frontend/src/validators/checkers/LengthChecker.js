import Checker from "@/validators/checkers/Checker";

class LengthChecker extends Checker {
    #toCheck
    #error = ""

    constructor(toCheck) {
        super()
        this.#toCheck = toCheck;
    }


    check(input) {
        let checks = this.#toCheck.checks

        if (checks.greater.isSelected && !this.#isGreater(input)) {
            return false
        }
        if (checks.greaterOrEqual.isSelected && !this.#isGreaterEqual(input)) {
            return false
        }
        if (checks.smaller.isSelected && !this.#isSmaller(input)) {
            return false
        }
        if (checks.smallerOrEqual.isSelected && !this.#isSmallerOrEqual(input)) {
            return false
        }
        return true
    }

    #isGreater(input) {
        if (input.length > this.#toCheck.min) {
            return true
        } else {
            this.#error = this.#toCheck.checks.greater.message + this.#toCheck.min
            return false
        }
    }

    #isGreaterEqual(input) {
        if (input.length >= this.#toCheck.min) {
            return true
        } else {
            this.#error = this.#toCheck.checks.greaterOrEqual.message + this.#toCheck.min
            return false
        }
    }

    #isSmaller(input) {
        if (input.length < this.#toCheck.max) {
            return true
        } else {
            this.#error = this.#toCheck.checks.smaller.message + this.#toCheck.max
            return false
        }
    }

    #isSmallerOrEqual(input) {
        if (input.length <= this.#toCheck.max) {
            return true
        } else {
            this.#error = this.#toCheck.checks.smallerOrEqual.message + this.#toCheck.max
            return false
        }
    }

    error() {
        return this.#error;
    }

    and() {
        return new LengthCheckerBuilder(this.#toCheck)
    }
}

class LengthCheckerBuilder {
    #toCheck

    constructor(toCheck = null) {
        this.#toCheck = toCheck != null
            ? toCheck
            :  {
                min: 0,
                max: 0,
                checks: {
                    greater: {
                        isSelected: false,
                        message: `length should be greater than `
                    },
                    greaterOrEqual: {
                        isSelected: false,
                        message: `length should be greater or equal to `
                    },
                    smaller: {
                        isSelected: false,
                        message: `length should be smaller then `
                    },
                    smallerOrEqual: {
                        isSelected: false,
                        message: `length should be smaller or equal to `
                    }
                }
            }
    }

    greaterThan(value) {
        this.#toCheck.min = value
        this.#toCheck.checks.greater.isSelected = true
        return new LengthChecker(this.#toCheck)
    }

    greaterOrEqualTo(value) {
        this.#toCheck.min = value
        this.#toCheck.checks.greaterOrEqual.isSelected = true
        return new LengthChecker(this.#toCheck)
    }

    smallerThan(value) {
        this.#toCheck.max = value
        this.#toCheck.checks.smaller.isSelected = true
        return new LengthChecker(this.#toCheck)
    }

    smallerOrEqualTo(value) {
        this.#toCheck.max = value
        this.#toCheck.checks.smallerOrEqual.isSelected = true
        return new LengthChecker(this.#toCheck)
    }
}

export default LengthCheckerBuilder