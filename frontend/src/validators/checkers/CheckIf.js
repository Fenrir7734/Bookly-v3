import BlankChecker from "@/validators/checkers/BlankChecker";
import LengthCheckerBuilder from "@/validators/checkers/LengthChecker";
import PatternChecker from "@/validators/checkers/PatternChecker";
import ValueCheckerBuilder from "@/validators/checkers/ValueChecker";

class CheckIf {
    isNotBlank() {
        return new BlankChecker()
    }

    lengthIs() {
        return new LengthCheckerBuilder()
    }

    match() {
        return new PatternChecker()
    }

    valueIs() {
        return new ValueCheckerBuilder();
    }
}

export default new CheckIf()