# binary-install

Install .tar.gz binary applications via npm

## Usage

This library provides a single class `Binary` that takes a download url and some optional arguments. You **must** provide either `name` or `installDirectory` when creating your `Binary`.

| option           | decription                                    |
| ---------------- | --------------------------------------------- |
| name             | The name of your binary                       |
| installDirectory | A path to the directory to install the binary |

If an `installDirectory` is not provided, the binary will be installed at `~/.npm-binaries/${name}/bin`

After your `Binary` has been created, you can run `.install()` to install the binary, and `.run()` to run it.

### Example

This is meant to be used as a library - create your `Binary` with your desired options, then call `.install()` in the `postinstall` of your `package.json` and `.run()` in the `bin` section of your `package.json`.

```js
const url = "https://example.com/binary.tar.gz";
let binary = new Binary(url, { name: "myBinary" });
binary.install();
binary.run();
```
