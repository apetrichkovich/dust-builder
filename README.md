# Сборщик шаблонов dust.js
## Описание
Был написан для Java проекта с Frontend-ом на Backbone.js, Marionette.js и Dust.js от LinkedIn.

1) Настроить переменную окружения:
`NODE_PATH=%AppData%\npm\node_modules`
3) Установить модули:
```bash
npm install -g child-process-promise
```

```bash
npm install -g uglify-js
```

```bash
npm install -g dustjs-linkedin
```
3) Запустить скрипт:
```bash
cd C:\projects\ls-templates
```
в Windows:
```bash
compileAndMinify.bat
```
или в Linux:
```bash
sh ./compileAndMinify.sh
```