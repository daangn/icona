# @icona/generator

## 0.6.0

### Minor Changes

- 1ef6f48: feat:

  - (generator): Add `.dart` generate method
  - This is for flutter projects and Need `.ttf` file to generate `.dart` file (You can use `font` option)

### Patch Changes

- Updated dependencies [1ef6f48]
  - @icona/types@0.6.0
  - @icona/utils@0.6.0

## 0.5.0

### Minor Changes

- af4efe8: - (generator) Added `svgtofont` package to generate `font` (eot, ttf, woff, woff2, svg) files from `SVG` files.
  - (generator) Added `config.font` method in `generate` function to generate `font` files.
  - (generator) Added `generateFont` method

### Patch Changes

- Updated dependencies [af4efe8]
  - @icona/types@0.5.0
  - @icona/utils@0.5.0

## 0.4.1

### Patch Changes

- 51a6e58: fix: png, pdf bar no stop issue
- Updated dependencies [51a6e58]
  - @icona/types@0.4.1
  - @icona/utils@0.4.1

## 0.4.0

### Minor Changes

- b04ef92: feat: add progress bar & change async & change png folder name (x1 -> 1x)

### Patch Changes

- Updated dependencies [b04ef92]
  - @icona/types@0.4.0
  - @icona/utils@0.4.0

## 0.3.0

### Minor Changes

- b9e4030: feat: Extract PNG images by scale

### Patch Changes

- Updated dependencies [b9e4030]
  - @icona/types@0.3.0
  - @icona/utils@0.3.0

## 0.2.2

### Patch Changes

- ccd993b: chore: 폴더가 없을 때 deleteAllFilesInDir 예외처리 및 폴더 생성은 한번만
- Updated dependencies [ccd993b]
  - @icona/utils@0.2.2
  - @icona/types@0.2.2

## 0.2.1

### Patch Changes

- 76e145e: chore: change SvgToPdfOptions type
- Updated dependencies [76e145e]
  - @icona/types@0.2.1
  - @icona/utils@0.2.1

## 0.2.0

### Minor Changes

- c43e052: feat: add generate mode option

  - `overwrite` (default): overwrite existing files in folder
  - `recreate`: rm -rf all files and generate new files in folder

### Patch Changes

- Updated dependencies [c43e052]
  - @icona/types@0.2.0
  - @icona/utils@0.2.0

## 0.1.0

### Minor Changes

- 9e98a6d: PNG 내보내기 & width, height 정보 받기
- ae02a6f: Add png export

### Patch Changes

- Updated dependencies [9e98a6d]
- Updated dependencies [ae02a6f]
  - @icona/types@0.1.0
  - @icona/utils@0.1.0

## 0.0.17

### Patch Changes

- 99cffa8: @icona/types move to dependencies

## 0.0.16

### Patch Changes

- 3cfbfa1: Enhance error message

## 0.0.15

### Patch Changes

- 8265bdf: feat(generator, type): Add description about pdfkit info option and add default option
- 8265bdf: delete CreationDate in pdfkit

## 0.0.14

### Patch Changes

- 44aca2d: fix: drawable defaultColor 옵션 안 먹던거 수정

## 0.0.13

### Patch Changes

- 6868b2a: change .icons file data struct
- Updated dependencies [6868b2a]
  - @icona/utils@0.0.13

## 0.0.12

### Patch Changes

- 6475f78: fix pdf options
- Updated dependencies [6475f78]
  - @icona/utils@0.0.12

## 0.0.10

### Patch Changes

- c62dc32: Not use CLI, instead Generator
- Updated dependencies [c62dc32]
  - @icona/utils@0.0.10

## 0.0.9

### Patch Changes

- 68f7418: bump test
- Updated dependencies [68f7418]
  - @icona/utils@0.0.9

## 0.0.8

### Patch Changes

- 8bd5ea3: bump test
- Updated dependencies [8bd5ea3]
  - @icona/utils@0.0.8

## 0.0.7

### Patch Changes

- 9d4053c: bump
- Updated dependencies [9d4053c]
  - @icona/utils@0.0.7

## 0.0.3

### Patch Changes

- 1ed9754: bump
- Updated dependencies [1ed9754]
  - @icona/utils@0.0.3

## 0.0.2

### Patch Changes

- 78ce9d5: Init
- Updated dependencies [78ce9d5]
  - @icona/utils@0.0.2
