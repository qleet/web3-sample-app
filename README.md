# web3-sample-app

## Requirements

* [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  ```bash
  nvm install v18.10.0
  nvm use v18.10.0
  nvm alias default v18.10.0
  npm install npm --global
  ```
* [pnpm](https://pnpm.io/installation)
  ```bash
  npm install -g pnpm
  ```
* [kapp](https://carvel.dev/kapp/docs/latest/install)
  ```bash
  curl -L https://carvel.dev/install.sh | bash
  ```
## Features & Plugins

- React, TypeScript, [Vite](https://github.com/vitejs/vite)
- [ethers.js](https://github.com/ethers-io/ethers.js)
- i18n, store - works out-of-box
- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) - CSS framework for rapid UI development

## Help

```bash
$ make help
```
```text
Usage: make COMMAND
Commands :
help           - List available tasks
clean          - Cleanup
install        - Install
build          - Build
update         - Update
upgrade        - Upgrade
run            - Run
image          - Build Docker Image
check-version  - Ensure VERSION variable is set
release        - Creates and pushes tag for the current $VERSION
tag-release    - Create and push a new tag
```

## Usage

```bash
make run
```

## Kubernetes deployment

### Create registry secret

Create `docker-registry` secret to access private image repository. Requires environment variable `$GH_ACCESS_TOKEN`

```bash
export NS=web3
kubectl create ns -name $NS
kubectl delete secret ghcr-login-secret -n $NS
kubectl create secret docker-registry ghcr-login-secret --docker-server=ghcr.io --docker-username=qleet --docker-password=$GH_ACCESS_TOKEN --docker-email=default -n $NS
kubectl -n $NS patch serviceaccount default -p '{"imagePullSecrets": [{"name": "ghcr-login-secret"}]}'
```

### Deploy workload

```bash
export KAPP_NAME=react-web3
kapp deploy -a $KAPP_NAME -f ./k8s --diff-changes --yes --into-ns $NS
kapp inspect -a $KAPP_NAME  --tree
```

### Get workload's IP

```bash
service_ip=$(kubectl get services web3-sample-app -n  $NS -o jsonpath="{.status.loadBalancer.ingress[0].ip}")
xdg-open "http://${service_ip}:80" > /dev/null 2>&1
```

### Delete workload

```bash
export KAPP_NAME=react-web3
kapp delete -a $KAPP_NAME -n default --yes
```

## Release

- Update field [Version](./src/components/Layout.tsx#L25)
  ```text
  const Version = "vX.Y.Z"
  ```

- Run `release` target
  ```bash
  make release
  ```

