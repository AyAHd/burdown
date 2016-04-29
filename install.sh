#!/bin/bash
npm install mongodb express --no-bin-links

#Install BDD
mongoimport -d burdown -c point --type json --file data.json --jsonArray
