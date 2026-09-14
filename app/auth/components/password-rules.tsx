type PasswordRulesProps = {
    password: string;
};

export const PASSWORD_RULES = [
    {
        id: "length",
        label: "Mínimo 8 caracteres",
        validate: (password: string) => password.length >= 8,
    },
    {
        id: "upper",
        label: "Al menos una letra mayúscula (A-Z)",
        validate: (password: string) => /[A-Z]/.test(password),
    },
    {
        id: "lower",
        label: "Al menos una letra minúscula (a-z)",
        validate: (password: string) => /[a-z]/.test(password),
    },
    {
        id: "number",
        label: "Al menos un número (0-9)",
        validate: (password: string) => /[0-9]/.test(password),
    },
    {
        id: "special",
        label: "Al menos un carácter especial (!@#$%^&*...)",
        validate: (password: string) => /[^A-Za-z0-9]/.test(password),
    },
];

export function validatePasswordComplexity(password: string): {
    isValid: boolean;
    failedRules: string[];
} {
    const failedRules = PASSWORD_RULES.filter((r) => !r.validate(password)).map(
        (r) => r.label
    );
    return {
        isValid: failedRules.length === 0,
        failedRules,
    };
}

export function PasswordRules({ password }: PasswordRulesProps) {
    return (
        <div className="rounded-lg border border-primary/15 bg-primary-light p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="text-primary" aria-hidden="true">
                    ◈
                </span>

                Reglas de seguridad
            </h2>

            <ul className="space-y-1 text-xs">
                {PASSWORD_RULES.map((rule) => {
                    const isValid = rule.validate(password);

                    return (
                        <li
                            key={rule.label}
                            className={
                                isValid
                                    ? "text-success"
                                    : "text-text-secondary"
                            }
                        >
                            <span className="mr-2" aria-hidden="true">
                                {isValid ? "✓" : "•"}
                            </span>

                            {rule.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}