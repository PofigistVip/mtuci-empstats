Z8 Template - пример проекта на базе фреймворка [Z8](https://github.com/zenframework/z8/)

Описание фреймворка Z8, а также проекта Z8 Template приведено в [Wiki проекта Z8](https://github.com/zenframework/z8/wiki)

# Z8 Template Project Build How-to

Copy _gradle.properties.default_ to _gradle.properties_ then choose one of project building options.

You have 2 options to develope Z8 porject:
1. Using Z8 Project sources from Git - _z8.home_ must point to Z8 Project folder, Gradle build script assumes Z8 Project is in Eclipse workspace
1. Using Z8 Project binaries - _z8Home_ must not be set

Eclipse workspace configuration:
1. If you use Z8 Project sources, Z8 Project must be in the same workspace.
1. If you use Z8 Project binaries, subproject _org.zenframework.z8.lang_ must be in the same workspace. Other Z8 dependencies are resolved with Gradle Maven plugin.
