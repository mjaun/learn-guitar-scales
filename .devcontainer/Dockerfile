FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8

# Dev tooling and locale (VS Code forwards the host's en_US.UTF-8).
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl git sudo locales less jq unzip openssh-client vim bash-completion \
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

# Non-root user (replaces the image's default "ubuntu" user, uid 1000) so files written
# through the bind mount belong to the developer.
RUN userdel -r ubuntu \
    && useradd -m -u 1000 -s /bin/bash vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode \
    && mkdir -p /home/vscode/.claude && chown vscode:vscode /home/vscode/.claude

ENV DEBIAN_FRONTEND=
