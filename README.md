# Latori Webpack Skeleton Theme

---

## I. INTRODUCTION

Due to Shopify's strategic decision to no longer support SASS files in a theme in the medium term, it has now become necessary for Latori GmbH (further referred to as Latori) to find technological ways to render SASS files locally and upload the generated CSS files via Shopify Theme Kit.

This is where so-called "Module Bundlers" come into play, which process all resources of a website (img, js, sass), bundle them and export them according to the project requirements.

There are currently several well-known bundlers on the market, such as [rollup](https://rollupjs.org/guide/en/), [fusebox](https://fuse-box.org/), [parcel](https://parceljs.org/), but also [gulp]().

However, [webpack](https://gulpjs.com/), which was launched by German developer Tobias Koppers in 2012, currently enjoys the widest distribution and the best maintenance.

That's why Latori made the decision to create a development environment that meets the new requirements with this bundler.

---

## II. PREQUISITE

Install [Homebew](https://brew.sh/)

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Shopify Theme Kit

```
brew tap shopify/shopify
brew install themekit
```

Install [yarn](https://classic.yarnpkg.com/)

```
brew install yarn
``` 

Install [mkcert](https://github.com/FiloSottile/mkcert)
```
brew install mkcert
```

---

## III. START

### Webpack

First install all necessary modules, which wepback needs to work with. This will take 1–2 minutes, so grab a coffee ☕️

```
yarn
```

After this there should be a new `node_modules` directory in your project.
### Shopify Theme Kit

Theme Kit is a cross-platform command line tool that you can use to build Shopify themes. You can think of it like a middleware between your local theme files and the remote theme files on the Shopify store.

#### Setting up the credentials

Before you start, you will need special credentials, so that you have access to the remote theme files. Please follow the steps on [Step 2: Generate API credentials](https://shopify.dev/tools/theme-kit/getting-started#step-2-generate-api-credentials). Please keep in my mind, that we always use `Latori Theme Kit` as the **Private app name** and `shops@latori.com` as the **Emergency developer email**. When you are done, please copy the generated **Password** of your private app.

Now create an `.env` file in the root folder

```
touch .env
```

Inside the file: 

```yaml
SHOP_API_PASSWORD = # paste the password here
```

#### Setting up the config.yml

In the root folder of your project you will find a `config.yml`. This file is mandatory and different for each project, so you should change the data in it very carefully.

The base version should look like this:

```yaml
development:
  password: ${SHOP_API_PASSWORD}
  theme_id: ${DEVELOPER_THEME_ID}
  store: XXXXXX.myshopify.com
  directory: ./dist
  timeout: 60s
  ignore_files:
    - config/settings_data.json
    - locales/*
  config:
    storefront_access_token: XXXXXXXXXXXXXXXXXXXX

staging:
  password: ${SHOP_API_PASSWORD}
  theme_id: 000000000000000
  store: XXXXXX.myshopify.com
  directory: ./dist
  timeout: 60s
  ignore_files:
    - config/settings_data.json
    - locales/*
  config:
    storefront_access_token: XXXXXXXXXXXXXXXXXXXX
    # protected: true
    # gatekey: rteust

production:
  password: ${SHOP_API_PASSWORD}
  theme_id: 000000000000000
  store: XXXXXX.myshopify.com
  directory: ./dist
  timeout: 60s
  ignore_files:
    - config/settings_data.json
    - locales/*
  config:
    storefront_access_token: XXXXXXXXXXXXXXXXXXXX
    # protected: true
    # gatekey: rteust
```

The terms `development`, `staging` and `production` describe different environments and should map to a similar theme structure in your Shopify shop, where you distinguish between your own theme (development), a theme to present to the client (staging) and the live theme (production).

Every environment needs a `password`, which will be injected by the `.env` file. This ensures that this sensitive data is not put into the git when committing the `config.yml` to your repository.

The keys `theme_id` and `store` should be adjusted to your concrete shop data.

The key `ignore_files` should at least contain the route to the `settings_data.json` file, which should **NEVER** be dropped there, or you can fear data loss from themes edited by the Shopify customizer. All language files in the `locales` folder can be ingored, but this is not a must-have.

The key `config` contains optional keys – all those will be used by webpack and injected in the global `process.env` object, which you can use in your javascript files. There are three standard keys:

- `storefront_access_token`: A non-sensitive credential to have access to the Shopify Storefront API
- `protected` and `gatekey`: you will need both at once – they will only be used, if you need to create critical css files in a password-protected development store.

### Source Files (src)

Inside the root folder of your project you have a `src` folder, where you will find all the sass and javascript ressources.

In the base configuration it should look like this:

```
src
|-- js
|-- sass
|-- templates
```

You can ignore the `templates` folder – inside you will find mandatory template files, which webpack needs to generate the necessary liquid snippets (`script-tags.liquid`, `style-tags.liquid`, `critical-style.liquid` and `checkout-assets.liquid`) to inject css and js automatically.

Inside of the `js` and `sass` folder you will have a  naming structure, which is exactly the same template structure as that of Shopify:

- `404`
- `article`
- `blog`
- `cart`
- `collection`
- `customers`
- `index`
- `page`
- `password`
- `product`
- `search`

The `main` file is a special one: treat this as the global file, which will be injected on every page template of the Shopify store. Inside of it you can define e.g. the header or the footer.

### Theme files (dist)

Inside the root folder of your project you have a `dist` folder, where you will find all the Shopify theme files and webpack-generated assets.

You can adjust everything to your needs, please be aware that the following files should never be edited manually:

```
dist
|-- assets
    |-- latori-theme.*.js
    |-- latori-theme.*.css
|-- snippets
    |-- script-tags.liquid
    |-- style-tags.liquid
    |-- critical-style.liquid
    |-- checkout-assets.liquid
```

These ones are created by webpack automatically.

There is one thing to keep in mind, if you use the `assets` folder for any files related to your theme: You won't have any chance to get a working path to your files without using any liquid context. The urls to those files are generated by the Shopify servers and can change due to caching reasons. For this reason you will have to use the `snippets/css-fonts-variables.liquid` file. Inside of it you can define your own typography or colors and combine any liquid-generated information by setting up css-variables to the `:root` selector. The base configuration:

```liquid
<style>
    :root {
        --colors-headlines: {{ settings.colors_headlines | color_to_rgb | replace: 'rgb(', '' | replace: ')' }};
        --colors-text: {{ settings.colors_text | color_to_rgb | replace: 'rgb(', '' | replace: ')' }};
    }
</style>
```

If you want to use any custom fonts, here you can get an example:

```liquid
<style>
    @font-face {
        font-family: 'Superduper Font';
        font-weight: normal;
        font-style: normal;
        font-display: swap;
        src: url("{{ 'SuperduperFont.eot' | asset_url }}");
        src: url("{{ 'SuperduperFont.eot' | asset_url }}") format('embedded-opentype'),
            url("{{ 'SuperduperFont.woff2' | asset_url }}") format('woff2'),
            url("{{ 'SuperduperFont.woff' | asset_url }}") format('woff'),
            url("{{ 'SuperduperFont.ttf' | asset_url }}") format('truetype'),
            url("{{ 'SuperduperFont.svg' | asset_url }}") format('svg');
    }
</style>
```

---
## IV. Watch process

If you installed everything properly, you can now start the watch process.

```
yarn watch
```

By entering this command, two different processes defined in the `package.json` will now start to execute:

- Shopify Theme Kit starts a watch process and checks, if anything inside of the `dist` folder changes. If something changes, only those files will be uploaded and replaced to the remote Shopify theme store files. It will use the environment `development`, defined in the `config.yml`, to find the correct theme in the store. After the upload is done, the `theme_ready` file will be touched to change the `edited` timestamp in the file header.
- Webpack starts a watch process, first generating js and css files into the `assets` folder and always regenerates them, if anything inside of the `src` folder changes. On init, it also starts a proxy connection to the Shopify store, uses the `store` key inside the `config.yml`, adds the query params `_fd=0&pb=0` to the url and opens it in a browser window. Shopify sites with redirection enabled for custom domains force redirection to that domain and `?_fd=0` prevents that forwarding, while `?pb=0` hides the Shopify preview bar. A convenient side effect: it automatically reloads the browser window, if the Shopify Theme Kit watch process touches the `theme_ready` file, so that it only really reloads if any files changed remotely.

Please be aware: if you have a running watch process, webpack can only watch files which existed before starting the watch process.

## V. Deploy process

---

If you're ready to ship your code, now the `deploy` command comes into place.

We distinguish between three different `deploy` commands: 

```
yarn deploy:development
```

Use this command only, if you want a completely re-upload of your development files to your development theme. This is very handy if you e.g. forgot to stop your watch process while changing your branch.

```
yarn deploy:staging
```

Use this command, to ship your local theme files to your remote `staging` theme, which is defined in the `config.yml`. If you use `yarn watch` or `yarn deploy:development`, your code won't be shipped production ready, because webpack uses the `NODE_ENV === 'development'` environment to process your codebase. Javascript files will generate css code on-the-fly, so there won't be any css-files in the `assets` folder. The proxy functionality will also be shipped inside the js files and it will be tampered with unneccessary code lines. But: in a staging context, you will get a production-ready code. This means, css and js files are minified and generated separately to the `assets` folder. Inside of the js-files you will have ES5 converted code and all the css files will be autoprefixed.

```
yarn deploy:production
```

Use this command, to ship the final code to your live `production` theme. It will ship the same code base like produced in the `staging` context, but uses a different theme for this, which is also defined inside the `config.yml`.

---

## VI. Critical file generation

Performance is one of the most important things to consider while developing a new theme for a Shopify store. It even becomes more important because of the very strict conventions defined by Google Pagespeed.

To handle the needs for a critical css file generation, you can use our auto-generation script, powered by [puppeteer](https://github.com/puppeteer/puppeteer) and [penthouse](https://github.com/pocketjoso/penthouse).

In the `package.json` you will find some settings to adjust it to your needs:

```json
{
    "critical": [
        {
            "template": "main",
            "url": "/"
        },
        {
            "template": "index",
            "url": "/"
        },
        {
            "template": "collection",
            "url": "/collections/all"
        }
    ],
    "criticalViewports": [
        {
            "width": 1280,
            "height": 1024
        }
    ]
}
```

In those settings you can decide, which pages should be loaded and on which viewports it should be viewed.

Please keep in mind, that it slows down the process with every critical path, multiplied with every entry of the viewports.

Before you start the critical css generation, you should deploy a most recent version to your production theme. After you are done, type

```
yarn critical:production
```

Now a headless Chromium browser should start, viewing all the paths and viewports defined in the `package.json` file and autogenerate critical css code, which will be auto-injected to the `dist/snippets/critical-style.liquid` file.

Please adjust the config keys `protected` and `gatekey` inside of the `config.yml` to bypass the password page in development stores.