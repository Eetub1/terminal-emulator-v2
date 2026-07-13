import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        files: ["**/*.{ts,js}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "double"],
        },
    },
);