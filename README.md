# snapshot-build-demo

A demo of [Snapshot](https://snapshot.show)'s **blessed `build.sh`** mode — publishing a
site built with **any toolchain** (here, a dependency-free Node script), not just
Julia/Pluto notebooks or Therapy apps.

The whole contract:

```toml
# snapshot.toml
type = "build"        # this repo is a custom build (or just drop a build.sh at the root)
[app]
output = "dist"       # the folder build.sh writes (default; shown for clarity)
```

```bash
# build.sh — Snapshot runs this in YOUR GitHub Actions; whatever lands in dist/ is published.
node build.mjs        # any toolchain: Node, Python, Hugo, a Makefile, a bash heredoc…
```

Snapshot runs `build.sh` in your own Actions (it never executes your build code on its
servers), then ingests `dist/` and serves it on the edge — with the platform's size and
safety limits applied to the output, and hosted on the sandboxed bundle origin.

Try it locally: `bash build.sh` → open `dist/index.html`.
