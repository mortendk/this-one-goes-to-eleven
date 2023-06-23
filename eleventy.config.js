const path = require("path");
const fs = require("fs");
const util = require('util');

// Get settings
const settings = require("./saga11.config.js");
const env = require("./src/content/_data/env.js");
const theme = settings.theme || "theme-grunn";
const packageJson = require("./package.json");
const saga11version = packageJson.version;
const dateLocalize = settings.dateLocalize || "";
const timeZone = settings.timeZone || "";

// plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");

const markdownIt = require('markdown-it');
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const embedVimeo = require("eleventy-plugin-vimeo-embed");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(faviconsPlugin);

  // Shortcodes
  eleventyConfig.addShortcode("image", require("./src/_system/11ty/shortcode/image.js"));
  eleventyConfig.addShortcode("imageurl", require("./src/_system/11ty/shortcode/imageurl.js"));
  eleventyConfig.addShortcode("calendar", require("./src/_system/11ty/shortcode/calendarlinks.js"));
  eleventyConfig.addShortcode("datediff", require("./src/_system/11ty/shortcode/datediff.js"));

  // Filters
  eleventyConfig.addFilter("slugify", require("./src/_system/11ty/filter/slugify.js"));
  eleventyConfig.addFilter("netlifycmsedit", require("./src/_system/11ty/filter/netlifycmsediturl.js"));
  eleventyConfig.addFilter("weekday", require("./src/_system/11ty/filter/dateWeekday.js"));
  eleventyConfig.addFilter("month", require("./src/_system/11ty/filter/dateMonth.js"));
  eleventyConfig.addFilter("dateformat", require("./src/_system/11ty/filter/dateFormat.js"));

  // todo: do we need these post liquid change
  eleventyConfig.addFilter("markdown", require("./src/_system/11ty/filter/markdown.js"));
  eleventyConfig.addFilter("sortByOrder", require("./src/_system/11ty/filter/sortByOrder.js"));
  eleventyConfig.addFilter("sortByTitle", require("./src/_system/11ty/filter/sortByTitle.js"));
  eleventyConfig.addFilter("sortByFilepath", require("./src/_system/11ty/filter/sortByFilepath.js"));
  eleventyConfig.addFilter("filtertags", require("./src/_system/11ty/filter/taglist.js"));
  eleventyConfig.addFilter("getPage", require("./src/_system/11ty/filter/getPage.js"));

  //RSS filters
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addLiquidFilter("dateToRfc822", pluginRss.dateToRfc822);
  eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", pluginRss.getNewestCollectionItemDate);
  eleventyConfig.addLiquidFilter("absoluteUrl", pluginRss.absoluteUrl);

  // gimme the data filter
  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<pre style="white-space: pre-wrap;">${unescape(str)}</pre>;`
  });

  eleventyConfig.addFilter("debug", require("./src/_system/11ty/filter/debug.js"));
  // eleventyConfig.addFilter("debugpretty", require("./src/_system/11ty/filter/debugPretty.js"));

  // Collections
  eleventyConfig.addCollection("allPosts", require("./src/_system/11ty/collection/allPosts.js"));
  eleventyConfig.addCollection("allPages", require("./src/_system/11ty/collection/allPages.js"));
  eleventyConfig.addCollection("allNotification", require("./src/_system/11ty/collection/allNotification.js"));
  eleventyConfig.addCollection("allTags", require("./src/_system/11ty/collection/allTags.js"));
  eleventyConfig.addCollection("tags", require("./src/_system/11ty/collection/tags.js"));
  eleventyConfig.addCollection("blocks", require("./src/_system/11ty/collection/blocks.js"));
  eleventyConfig.addCollection("styleguide", require("./src/_system/11ty/collection/styleguide.js"));

  // Transform
  if (env.mode == "prod") {
    eleventyConfig.addTransform("htmlmin", require("./src/_system/11ty/transform/minify.js"));
  }

  // Fix placement of files
  eleventyConfig.addPassthroughCopy({"src/theme-grunn/assets/" : "/assets/"});
  eleventyConfig.addPassthroughCopy({"src/theme-grunn/service-workers.js" : "service-workers.js"});
  eleventyConfig.addPassthroughCopy({"src/content/upload/" : "/content/upload/"});
  // eleventyConfig.addPassthroughCopy("src/themes/debug/");

  // global vars todo: is this existing for liquid ?
  eleventyConfig.addGlobalData("saga11version", saga11version);
  eleventyConfig.addGlobalData("theme", theme);
  eleventyConfig.addGlobalData("timezone", timeZone);
  eleventyConfig.addGlobalData("dateLocalize", dateLocalize);

  // Local Server
  eleventyConfig.setServerOptions({
    port: env.siteport,
  });

  // Ignore README
  eleventyConfig.ignores.add("README.md");

  // Liquid options
  eleventyConfig.setLiquidOptions({
    jsTruthy: true,
    dynamicPartials: true,
    strict_filters: true,
  });

  // Markdown IT
  eleventyConfig.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItEleventyImg, {
    imgOptions: {
      widths: [640, 1200],
      urlPath: "/img",
      outputDir: "./_site/img/",
      formats: ["webp"]
    },
    globalAttributes: {
      class: "md-image",
      decoding: "async",
      loading: "lazy",
      sizes: "100vw"
    },
    resolvePath: (filepath) => path.join('src', filepath)

  }));

  // embed youtube
  eleventyConfig.addPlugin(embedYouTube, {
    embedClass: 'md-video',
    lite: true,
    modestBranding: true
  });

  // embed vimeo
  eleventyConfig.addPlugin(embedVimeo, {
    embedClass: 'md-video',
    dnt: true
  });

  return {
    dir: {
      input: "src/",
      output: "_site",
      includes: theme + "/includes",
      layouts: theme + "/layouts",
      data: "content/_data",
    },
  };
};
