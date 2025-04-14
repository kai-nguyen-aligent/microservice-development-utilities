export interface ClientGeneratorSchema {
    name: string;
    schemaPath: string;
    importPath?: string;
    skipValidate: boolean;
    override: boolean;
}
