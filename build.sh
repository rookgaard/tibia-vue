#!/bin/sh

npm run build
zip -r dist.zip dist/
rm -r dist
