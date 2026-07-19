// Node.js v25 blocks require() for paths starting with '.' but not './' (e.g. '.prisma/...')
// This breaks Prisma's require('.prisma/client/default') in @prisma/client/default.js.
// Patch Module._resolveFilename to convert these to absolute paths before resolution.
import Module from 'module'
import path from 'path'

const originalResolve = (Module as unknown as { _resolveFilename: (...args: unknown[]) => string })._resolveFilename

;(Module as unknown as { _resolveFilename: (...args: unknown[]) => string })._resolveFilename = function(
  ...args: unknown[]
): string {
  const [request, parent, isMain, options] = args
  const parentObj = parent as { filename?: string } | null
  if (typeof request === 'string' && /^\.[a-zA-Z]/.test(request) && parentObj?.filename) {
    const abs = path.resolve(path.dirname(parentObj.filename), request)
    try {
      return originalResolve(abs, parent, isMain, options)
    } catch {
      // fall through
    }
  }
  return originalResolve(request, parent, isMain, options)
}
