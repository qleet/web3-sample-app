# Web3 sample app

## Requirements

- [curl](https://help.ubidots.com/en/articles/2165289-learn-how-to-install-run-curl-on-windows-macosx-linux)
- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  ```bash
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
help          - List available tasks
clean         - Cleanup
install       - Install NodeJS dependencies
build         - Build
upgrade       - Upgrade dependencies
run           - Run
image         - Build a Docker image
check-version - Ensure VERSION variable is set
release       - Create and push a new tag
kind-deploy   - Deploy to a local KinD cluster
kind-undeploy - Undeploy from a local KinD cluster
kind-redeploy - Redeploy to a local KinD cluster
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
xdg-open "http://${service_ip}:8080" > /dev/null 2>&1
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

Valid eth address to test:

```
0xeB2629a2734e272Bcc07BDA959863f316F4bD4Cf
```