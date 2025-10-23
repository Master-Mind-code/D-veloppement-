# Configure Belife VM

## Pre-requisites
For the needs of the pre-configuration, make sure to:
- Open 9000 port for portainer on VM NSG
- Create domain name and SSL for domain and sub-domain

## Install docker on VM

Run the following command

```shell
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
```

## Install Portainer

### Create an BE account and get license

### Create portainer container on VM

Run the following command

```shell
docker volume create portainer_data
docker network create -d bridge app-tier
docker run --network app-tier -d -p 8000:8000 -p 9000:9000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ee:2.21.4
```

## Configure Portainer

## Add registry
For adding registry you need to create a PAT token and register it on portainer.

## Create stacks by accessing portainer on port 9000

## Useful links

- https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04#step-1-installing-docker
- https://medium.com/@aytronn18/automate-portainer-deployment-with-github-workflows-809e02e0650c

