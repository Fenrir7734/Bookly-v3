import Checker from "@/validators/checkers/Checker";

class BlankChecker extends Checker {
    check(str) {
        return !(str === null || str.match(/^ *$/) !== null)
    }

    error() {
        return "cannot be blank"
    }
}

export default BlankChecker;