/**
 * This script is runned automatically after your first npm-install.
 */
const _prompt = require("prompt")
import { mv, rm, which, exec } from "shelljs"
const replace = require("replace-in-file")
const _colors = require("colors")
import * as path from "path"
import { readFileSync, writeFileSync } from "fs"
import { fork } from "child_process"

if (!which("git")) {
  console.log(_colors.red("Sorry, this script requires git"))
  process.exit(1)
}

function resolve(p: any) {
  return path.resolve(__dirname, "..", p)
}

function setupProject() {
  // Replace strings in corresponding files
  replace(
    {
      files,
      from: [/--libraryname--/g, /--username--/g, /--usermail--/g],
      to: [libraryName, username, usermail]
    },
    () => {
      // Rename main file and test
      const renamedFiles = [
        `src/${libraryName}.ts`,
        `test/${libraryName}.test.ts`
      ]
      mv(
        path.resolve(__dirname, "..", "src/library.ts"),
        path.resolve(__dirname, "..", renamedFiles[0])
      )
      mv(
        path.resolve(__dirname, "..", "test/library.test.ts"),
        path.resolve(__dirname, "..", renamedFiles[1])
      )

      console.log()
      console.log(_colors.cyan(renamedFiles.join(",")) + " renamed")
      console.log(_colors.cyan(files.join(",")) + " updated")

      // Recreate init folder and initialize husky
      exec('git init "' + path.resolve(__dirname, "..") + '"')
      console.log()
      console.log(_colors.cyan("Git initialized"))
      console.log()

      // Remove post-install command
      const pkg = JSON.parse(
        readFileSync(path.resolve(__dirname, "..", "package.json")) as any
      )
      delete pkg.scripts.postinstall
      writeFileSync(
        path.resolve(__dirname, "..", "package.json"),
        JSON.stringify(pkg, null, 2)
      )
      console.log()
      console.log(_colors.cyan("Removed postinstall script"))
      console.log()

      fork(
        path.resolve(__dirname, "..", "node_modules", "husky", "bin", "install")
      )

      console.log()
      console.log(_colors.green("Happy coding!! ;)"))
      console.log()
    }
  )
}

let libraryName = "test" // Default, in case it runns on a CI
let username = exec("git config user.name").stdout.trim()
let usermail = exec("git config user.email").stdout.trim()
let inCI = process.env.CI

const promptSchema = {
  properties: {
    library: {
      description: _colors.cyan("Enter your library name (use kebab-case)"),
      pattern: /^[a-z]+(\-[a-z]+)*$/,
      type: "string",
      required: true
    }
  }
}

const files = [
  resolve("package.json"),
  resolve("rollup.config.js"),
  resolve("LICENSE"),
  resolve("test/library.test.ts"),
  resolve("tools/gh-pages-publish.ts")
]

_prompt.start()
_prompt.message = ""

// Clear console
process.stdout.write('\x1Bc');

// Say hi!
console.log(_colors.yellow("Hi! I'm setting things up for you!!"))

// Remove .git folder
rm("-Rf", path.resolve(__dirname, "..", ".git"))
console.log("\r\n", "Removed .git directory", "\r\n")

// Remove files
const filesRm = ["tools/init.ts"]
const pathsRm = filesRm.map(f => path.resolve(__dirname, "..", f))
rm(pathsRm)
console.log(`\r\nRemoved files: ${filesRm.toString()}\r\n`)

if (!inCI) {
  // Ask for library name
  _prompt.get(promptSchema, (err: any, res: any) => {
    if (err) {
      console.log(_colors.red("There was an error building the workspace :("))
      process.exit(1)
      return
    }

    libraryName = res.library
    setupProject()
  })
} else {
  setupProject()
}
