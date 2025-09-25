# Shell Functions

Omaforge comes with a set of bash functions that simplify common tasks and solve complex jobs.

## Basic Functions

### `compress [file.tar.gz]` / `decompress [file.tar.gz]`

Create or expand a tar.gz file.

```bash
compress my-archive.tar.gz folder/
decompress my-archive.tar.gz
```

### `iso2sd [image.iso] [/path/to/sdcard]`

Create a bootable drive on an SD card using the referenced iso file.

```bash
iso2sd ubuntu-24.04.iso /dev/sdb
```

### File and Directory Operations

Various functions for common file operations, directory navigation, and system management tasks.

## Omaforge Functions

The main Omaforge command-line interface provides access to all system functions:

```bash
omaforge
```

This launches the interactive menu where you can:

- Install and uninstall applications
- Configure system settings
- Manage themes and appearance
- Access system utilities

## Usage Notes

- All functions are automatically loaded in your shell session
- Functions are designed to be intuitive and follow common Linux patterns
- Use `omaforge` as the primary entry point for system management
- Individual functions can be called directly from the command line

For a complete list of available functions, run `omaforge` and explore the interactive menu system.
