const { existsSync, mkdirSync } = require("fs");
const { homedir } = require("os");
const { join } = require("path");
const { spawnSync } = require("child_process");

const axios = require("axios");
const tar = require("tar");
const rimraf = require("rimraf");

class Binary {
  constructor(url, data) {
    this.url = url;
    this.name = data.name || -1;
    this.installDirectory = data.installDirectory || -1;
    this.binaryDirectory = -1;
    this.binaryPath = -1;
  }

  _getInstallDirectory() {
    if (this.installDirectory === -1) {
      if (this.name === -1) {
        throw "You must provide either a name or an install directory to install this tool";
      }
      const rootInstall = join(homedir(), ".npm-binaries");
      if (!existsSync(rootInstall)) {
        mkdirSync(rootInstall);
      }
      this.installDirectory = join(homedir(), ".npm-binaries", this.name);
    }
    return this.installDirectory;
  }

  _getBinaryDirectory() {
    if (this.binaryDirectory === -1 && this.installDirectory === -1) {
      throw `${this.name ? this.name : "Your package"} has not been installed!`;
    } else if (this.installDirectory !== -1) {
      const binaryDirectory = join(this.installDirectory, "bin");
      if (existsSync(binaryDirectory)) {
        this.binaryDirectory = binaryDirectory;
      }
    }
    return this.binaryDirectory;
  }

  _getBinaryPath() {
    if (this.binaryPath === -1) {
      const binaryDirectory = this._getBinaryDirectory();
      this.binaryPath = join(binaryDirectory, this.name);
    }

    return this.binaryPath;
  }

  install() {
    const dir = this._getInstallDirectory();
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    this.binaryDirectory = join(dir, "bin");

    if (existsSync(this.binaryDirectory)) {
      rimraf.sync(this.binaryDirectory);
    }

    mkdirSync(this.binaryDirectory);

    console.log("Downloading release", this.url);

    return axios({
      url: this.url,
      responseType: "stream"
    })
      .then(res => {
        res.data.pipe(
          tar.x({
            strip: 1,
            C: this.binaryDirectory
          })
        );
      })
      .then(() => {
        console.log(
          `${this.name ? this.name : "Your package"} has been installed!`
        );
      })
      .catch(e => {
        console.error("Error fetching release", e.message);
        throw e;
      });
  }

  run() {
    const binaryPath = this._getBinaryPath();
    const [, , ...args] = process.argv;

    const options = {
      cwd: process.cwd(),
      stdio: "inherit"
    };

    const result = spawnSync(binaryPath, args, options);

    if (result.error) {
      console.error(result.error);
      process.exit(1);
    }

    process.exit(result.status);
  }
}

module.exports = Binary;
