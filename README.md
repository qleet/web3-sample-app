# Web3 sample app

## Requirements

- [curl](https://help.ubidots.com/en/articles/2165289-learn-how-to-install-run-curl-on-windows-macosx-linux)
- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$(curl -sL https://api.github.com/repos/nvm-sh/nvm/releases/latest  | grep '"tag_name":' | awk -F '"' '{printf("%s",$4)}' | cut -c 2-)/install.sh | bash
  nvm install v18.10.0
  nvm use v18.10.0
  nvm alias default v18.10.0
  npm install npm --global
  ```
- [pnpm](https://pnpm.io/installation)
  ```bash
  npm install -g pnpm
  ```
- [kind >=0.16.0](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

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
kind-deploy    - Deploy to local kind cluster
kind-undeploy  - Undeploy from local kind cluster
```

## Usage

```bash
make run
```

## Kubernetes deployment

### Deploy using docker image from public repository

#### Deploy workload

```bash
kubectl apply -f ./k8s --namespace=web3 --validate=false
```

#### Get workload's IP

```bash
service_ip=$(kubectl get services web3-sample-app -n web3 -o jsonpath="{.status.loadBalancer.ingress[0].ip}")
xdg-open "http://${service_ip}:80" > /dev/null 2>&1
```

#### Delete workload

```bash
kubectl delete -f ./k8s --namespace=web3
```

### Deploy to local Kind cluster

```bash
make kind-deploy
```

### Undeploy from local Kind cluster

```bash
make kind-undeploy
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
