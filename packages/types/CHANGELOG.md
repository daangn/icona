# @icona/types

## 0.5.0

### Minor Changes

- af4efe8: - (generator) Added `svgtofont` package to generate `font` (eot, ttf, woff, woff2, svg) files from `SVG` files.
  - (generator) Added `config.font` method in `generate` function to generate `font` files.
  - (generator) Added `generateFont` method

## 0.4.1

### Patch Changes

- 51a6e58: fix: png, pdf bar no stop issue

## 0.4.0

### Minor Changes

- b04ef92: feat: add progress bar & change async & change png folder name (x1 -> 1x)

## 0.3.0

### Minor Changes

- b9e4030: feat: Extract PNG images by scale

## 0.2.2

### Patch Changes

- ccd993b: chore: 폴더가 없을 때 deleteAllFilesInDir 예외처리 및 폴더 생성은 한번만

## 0.2.1

### Patch Changes

- 76e145e: chore: change SvgToPdfOptions type

## 0.2.0

### Minor Changes

- c43e052: feat: add generate mode option

  - `overwrite` (default): overwrite existing files in folder
  - `recreate`: rm -rf all files and generate new files in folder

## 0.1.0

### Minor Changes

- 9e98a6d: PNG 내보내기 & width, height 정보 받기
- ae02a6f: Add png export

## 0.0.13

### Patch Changes

- 8265bdf: feat(generator, type): Add description about pdfkit info option and add default option

## 0.0.12

### Patch Changes

- 6475f78: fix pdf options

## 0.0.11

### Patch Changes

- c62dc32: Not use CLI, instead Generator

## 0.0.9

### Patch Changes

- 68f7418: bump test

## 0.0.8

### Patch Changes

- 8bd5ea3: bump test

## 0.0.7

### Patch Changes

- 9d4053c: bump

## 0.0.3

### Patch Changes

- 1ed9754: bump

## 0.0.2

### Patch Changes

- 78ce9d5: Init
