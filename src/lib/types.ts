export type ActionsState<T> = {
    success: boolean;
    message?: string;
    errors?: { [K in keyof T]?: string[] | undefined };
    redirect?: string;
} & {
    [key: string]: unknown;
};

export type Errors = Partial<Record<string, string[]>>;
