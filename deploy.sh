#!/bin/bash

time rsync -hsaPv --progress --stats --delete -e "ssh -C -c aes128-ctr" ./ claudius@188.212.37.221:/var/web/solirom-admin-site/
