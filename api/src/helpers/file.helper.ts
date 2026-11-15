import {resolve} from 'node:path'

const PROJECT_ROOT = process.cwd()

export function getProjectFile(...paths: string[]): string {
    return resolve(PROJECT_ROOT, ...paths)
}