# Installation

Get started with Omaforge on your Ubuntu system

> [!WARNING]
> Although a stable version has been released, **Omaforge is still an experimental project with an [unclear future](https://github.com/forge-ext/forge/issues/336)**. I recommend installing it to try it out, **_not using it on a daily basis_**.

## Prerequisites

- [A fresh install of Ubuntu Server](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview), only 24.04 LTS version
- A stable connection, to avoid errors when downloading apps and packages

You can follow the Ubuntu Server installation guide as suggested above. Use disk encryption only if you deem it necessary. _Do not install any other packages or SSH keys; they are not needed_. Once the installation is complete and you are logged in, you should leave the system as is.

## Installation

To install Omaforge, simply run the following command in your terminal:

```bash
curl -fsSL https://omakasui.org/omaforge | bash
```

## Troubleshooting

### Installation Failed

If installation fails, retry with:

```bash
source ~/.local/share/omaforge/install.sh
```

### Permission Issues

Ensure you have sudo privileges:

```bash
sudo -v
```

### Overview on First Boot

When you log in for the first time, even though it's disabled, you'll likely find yourself in the GNOME overview screen. In this case, _just click on the workspace (any one!) and you'll finally be able to start playing_.
