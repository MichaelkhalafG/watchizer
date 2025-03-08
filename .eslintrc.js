module.exports = {
    root: true,
    extends: ["react-app"],
    rules: {
        "no-console": "warn",
        "no-debugger": "warn",
        "react/prop-types": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "jsx-a11y/anchor-is-valid": "off",
        "react/self-closing-comp": "warn",
        "react/jsx-key": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    overrides: [
        {
            files: ["**/*.test.js", "**/*.spec.js"],
            rules: {
                "no-unused-expressions": "off" // تعطيل قاعدة غير ضرورية في اختبارات Jest
            }
        }
    ]
};
