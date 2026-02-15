declare global {
    interface Window {
        electronAPI: {
            getAppVersion: () => Promise<string>;
            getAppPath: () => Promise<string>;
            saveData: (filename: string, data: string) => Promise<{
                success: boolean;
                error?: string;
            }>;
            loadData: (filename: string) => Promise<{
                success: boolean;
                data?: string;
                error?: string;
            }>;
            deleteData: (filename: string) => Promise<{
                success: boolean;
                error?: string;
            }>;
            isElectron: () => boolean;
        };
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map