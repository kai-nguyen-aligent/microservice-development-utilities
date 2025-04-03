import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'fs';
import { joinPathFragments } from 'nx/src/utils/path';
import { setWorkspaceRoot, workspaceRoot } from 'nx/src/utils/workspace-root';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

/**
 * A utility class for managing a temporary file system.
 *
 * This class creates a temporary directory and provides methods for creating files,
 * resetting the directory, and cleaning up the temporary file system. It also allows
 * overriding the workspace root for testing purposes.
 */
export class TempFs {
    readonly tempDir: string;

    private previousWorkspaceRoot: string;

    /**
     * Creates an instance of the TempFs class.
     *
     * @param {string} dirname - The name of the temporary directory.
     * @param {boolean} [overrideWorkspaceRoot=true] - Whether to override the workspace root with the temporary directory.
     */
    constructor(
        private dirname: string,
        overrideWorkspaceRoot = true
    ) {
        this.tempDir = realpathSync(mkdtempSync(join(tmpdir(), this.dirname)));
        this.previousWorkspaceRoot = workspaceRoot;

        if (overrideWorkspaceRoot) {
            setWorkspaceRoot(this.tempDir);
        }
    }

    /**
     * Creates a file in the temporary file system with the specified content.
     *
     * @param {string} filePath - The relative path of the file to create.
     * @param {string} content - The content to write to the file.
     */
    createFileSync(filePath: string, content: string) {
        const dir = joinPathFragments(this.tempDir, dirname(filePath));
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        writeFileSync(joinPathFragments(this.tempDir, filePath), content);
    }

    /**
     * Cleans up the temporary file system by removing the temporary directory
     * and restoring the previous workspace root.
     */
    cleanup() {
        rmSync(this.tempDir, { recursive: true, force: true });
        setWorkspaceRoot(this.previousWorkspaceRoot);
    }

    /**
     * Resets the temporary file system by deleting all contents of the temporary directory
     * and recreating it.
     */
    reset() {
        rmSync(this.tempDir, { recursive: true, force: true });
        mkdirSync(this.tempDir, { recursive: true });
    }
}
