# minio-js-resizer

## Description
A small NodeJS app that listens for uploads on the source Minio bucket and assuming that's an image generates smaller
version that is being uploaded to the destination Minio bucket on the same path.

## Design
Designed to be run in Docker and configured via environment variables.

Uses `gm` for resizing which support variaty of formats including `jpg`, `png`, `gif` etc.

## Quality
Very much work in progress and PoC but it does what it says.

## Configuration
```
RESIZER_ENDPOINT=my.minio.com
RESIZER_PORT=443
RESIZER_SECURE=true

RESIZER_ACCESS_KEY=access-key
RESIZER_SECRET_KEY=secret-key

RESIZER_SOURCE=src-bucket-name
RESIZER_DESTINATION=dst-bucket-name

RESIZER_MAX_WIDTH=1000
RESIZER_MAX_HEIGHT=1000
```

## Usage
```
$ docker run --rm --env-file .env -it minio-js-resizer
Listening on 'input' for events
Processing 'output:content/Future-Trapped-Between-Pasts.png'
Successfully uploaded 'output:content/Future-Trapped-Between-Pasts.png' with md5sum 'e3ee4f0bd13e14b76fef8fd00c757307'
```
