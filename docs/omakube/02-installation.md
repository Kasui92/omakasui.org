# Installation

Get started with Omakube on your Ubuntu system

## Prerequisites

- [A fresh install of Ubuntu Desktop](https://ubuntu.com/download/desktop) (24.04+) on your computer
- A stable connection, to avoid errors when downloading apps and packages

Installation requires a freshly installed Ubuntu Desktop system. You can try it on an existing installation, but conflicts with already installed applications and configurations may occur, and you’ll likely lose much of your customization work.

Omakub can also be installed on a system where Omakub is already present. In this case, however, it's recommended using the migration procedure described below.

The installation has been tested starting from Ubuntu 24.04 up to the latest version. That said, it's strongly suggested sticking to LTS releases to ensure a stable and predictable environment.

At the moment, _systems with LVM disk encryption are not supported_. Using them may cause boot issues, so this setup is not recommended.

## Installation

To install Omakube, simply run the following command in your terminal:

```bash
curl -fsSL https://omakasui.org/omakube | bash
```

If you encounter errors, you can consult the [dedicated section](/manuals/omakube/troubleshooting) in **troubleshooting**.
