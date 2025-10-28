# Archives Directory

This directory collects large archive artifacts (for example, downloaded `.zip` packages) that are not required for runtime execution. All zip bundles are stored in `./zips/` so they can be reviewed together or deleted as a unit if they are no longer needed.

To remove all archived zip files, delete the `archives/zips` directory:

```bash
rm -rf archives/zips
```

Because the archives are grouped in their own folder, there are no code-level references or symlinks pointing to the individual `.zip` files.
