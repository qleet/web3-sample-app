.DEFAULT_GOAL := help
VERSION := $(shell cat ./src/components/Layout.tsx | grep "const Version =" | awk -F"'" '{print $2}')

#help: @ List available tasks
help:
	@clear
	@echo "Usage: make COMMAND"
	@echo "Commands :"
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#' | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[32m%-14s\033[0m - %s\n", $$1, $$2}'

#clean: @ Cleanup
clean:
	@rm -rf node_modules/ dist/

#install: @ Install
install:
	pnpm install

#build: @ Build
build: install
	pnpm build

#update: @ Update
update:
	pnpm update

#upgrade: @ Upgrade
upgrade:
	pnpm upgrade

#run: @ Run
run: install
	pnpm dev

#image: @ Build Docker Image
image: install build
	docker build -t web3-sample-app:$(VERSION) .

#check-version: @ Ensure VERSION variable is set
check-version:
ifndef VERSION
	$(error VERSION is undefined)
endif
	@echo -n ""

#release: @ Creates and pushes tag for the current $VERSION
release: check-version tag-release

#tag-release: @ Create and push a new tag
tag-release: check-version
	echo -n "Are you sure to create and push ${VERSION} tag? [y/N] " && read ans && [ $${ans:-N} = y ]
	git commit -a -s -m "Cut ${VERSION} release"
	git tag ${VERSION}
	git push origin ${VERSION}
	git push
	echo "Done."

#kind-deploy: @ Deploy to local kind cluster
kind-deploy: image
	@kind load docker-image web3-sample-app:$(VERSION) -n kind && \
	cat ./k8s/ns.yaml | kubectl apply -f - && \
	cat ./k8s/cm.yaml | kubectl apply --namespace=web3 -f - && \
	yq eval '.spec.template.spec.containers[0].image = "web3-sample-app:$(VERSION)"' ./k8s/deployment.yaml | yq eval 'del(.spec.template.spec.containers[0].imagePullSecret)' | kubectl apply --namespace=web3 -f - && \
	cat ./k8s/service.yaml | kubectl apply --namespace=web3 -f -

#kind-undeploy: @ Undeploy from local kind cluster
kind-undeploy:
	@kubectl delete -f ./k8s/deployment.yaml --namespace=web3 --ignore-not-found=true && \
	kubectl delete -f ./k8s/cm.yaml --namespace=web3 --ignore-not-found=true && \
	kubectl delete -f ./k8s/ns.yaml --ignore-not-found=true
