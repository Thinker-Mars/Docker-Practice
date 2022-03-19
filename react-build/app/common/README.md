## <center>**common**</center>
此文档旨在介绍此模块，便于新人维护。

* <a href="#模块介绍">模块介绍</a>
* <a href="#注意事项">注意事项</a>

### <a name="模块介绍">模块介绍</a>
common为其它业务赋能，提供公用方法，不涉及任何业务逻辑，独立发布。

### <a name="注意事项">注意事项</a>
* 禁止出现业务代码

* 引用方式：

  ✔
  ```
  import { request } from 'common/helpers';
  ```

  ❌
  ```
  import request from 'common/helpers/request';
  ```

* 开发common模块

  根据功能区分，目前分为以下四个模块：

    * common/helpers: window.vendorHelpers

    * common/utils: window.vendorUtils

    * common/hooks: window.vendorHooks

    * common/constants: window.vendorConstants

  模块会挂载到window，作为全局变量，暴露给业务。当需要开发新的模块时，按照既有方式挂载到window，并修改 `build/webpack/`下的文件，在 `externals` 中指定打包时排除。