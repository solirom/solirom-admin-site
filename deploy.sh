#!/bin/bash

time rsync -hsaPv --exclude-from=rsync-exclude.txt --progress --stats --delete -e "ssh -C -c aes128-ctr" ./ claudius@85.186.121.41:/home/work/web/solirom-admin-site/
