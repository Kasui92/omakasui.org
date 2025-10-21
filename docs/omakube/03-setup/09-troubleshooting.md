# Troubleshooting

If you encounter any errors, this section is a good place to start troubleshooting.

## Installation

### Installation Failed

If installation fails, retry with:

```bash
source ~/.local/share/omakube/install.sh
```

### Permission Issues

Ensure you have sudo privileges:

```bash
sudo -v
```

### LVM encryption breaks boot

Apparently, if the disk is encrypted using LVM, the boot process hangs. This happens because LVM expects the password to unlock the disk before proceeding with the login.

A solution would be to either prevent installation when LVM is detected, or block the boot process and present a password entry form.

## Known Issue

### `X11` and `wofi`

`wofi` doesn’t work properly when the session is running on `X11`. This mainly affects users with _NVIDIA graphics cards_, where the system is usually forced to use Wayland (through a script in `/install/login/gdm3.sh`).

A long-term solution is being sought. In the meantime, if you run into issues with `wofi` on your first login, just log out and, on the next attempt, select **Ubuntu (Wayland)** from the bottom-right corner. After that, the system will always remember and use this option.
