const path = require("path");
const fs = require("fs");
const env = require("./src/content/data/env.js");
const settings = require("./saga11.config.js");
const theme = settings.theme || "grunn";

const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

async function picture(image) {
  // netlifycms have a tendency to create an empty image in the markdown image: "" so test for this and kill it
  if (image.img == "") {
    return "";
  }

  const widths = image.width || [640, 1024, 1563];
  const formats = image.format || ["webp", "jpeg"];
  const sizes = image.sizes || "(max-width: 640px) 50vw, 100vw";
  const css = image.css || "";
  const alt = image.alt || "";
  const loading = image.loading || "lazy"; //lazy or eager

  let src = "src" + image.img;

  // a really not so optimal way to test if its an existing image is actually there
  // TODO: test if the image is actaully there
  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  if (isValidUrl(image.img)) {
    src = image.img;
  }

  if (fs.existsSync(src) || isValidUrl(image.img)) {
    let metadata = await Image(src, {
      widths: widths,
      formats: formats,
      outputDir: "_site/img/", // send image directly to the site build
      sharpOptions: {
        animated: true,
      },
      urlPath: "/img/",
      cacheOptions: {
        duration: "1d",
        directory: ".cache",
        removeUrlQueryParams: false,
      },
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      },
    });

    let imageAttributes = {
      class: css,
      alt: alt,
      sizes: sizes,
      loading: loading,
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline",
    });
  } else {
    // console.log(`🎈 picture function: ${image} dont exist `);
    // return `<!-- image function called but: ${image} -->`;
    return "";
  }
}

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("picture", picture);
  eleventyConfig.addShortcode("imageurl", require("./src/system/11ty/shortcode/imageurl"));
  eleventyConfig.addShortcode("calendar", require("./src/system/11ty/shortcode/calendarlinks.js"));
  eleventyConfig.addShortcode("datediff", require("./src/system/11ty/shortcode/datediff.js"));

  // Filters
  eleventyConfig.addFilter("formatDate", require("./src/system/11ty/filter/formatDate.js"));
  eleventyConfig.addFilter("markdown", require("./src/system/11ty/filter/markdown.js"));
  eleventyConfig.addFilter("slugify", require("./src/system/11ty/filter/slugify.js"));
  eleventyConfig.addFilter("sortByOrder", require("./src/system/11ty/filter/sortByOrder.js"));
  eleventyConfig.addFilter("sortByTitle", require("./src/system/11ty/filter/sortByTitle.js"));
  eleventyConfig.addFilter("sortByFilepath", require("./src/system/11ty/filter/sortByFilepath.js"));
  eleventyConfig.addFilter("filtertags", require("./src/system/11ty/filter/taglist.js"));
  eleventyConfig.addFilter("getPage", require("./src/system/11ty/filter/getPage"));
  eleventyConfig.addFilter("netlifycmsedit", require("./src/system/11ty/filter/netlifycmsediturl"));
  eleventyConfig.addFilter("debug", require("./src/system/11ty/filter/debug"));
  eleventyConfig.addFilter("debugpretty", require("./src/system/11ty/filter/debugPretty"));

  // Collections
  eleventyConfig.addCollection("allPosts", require("./src/system/11ty/collection/allPosts.js"));
  eleventyConfig.addCollection("allPages", require("./src/system/11ty/collection/allPages.js"));
  eleventyConfig.addCollection("allNotification", require("./src/system/11ty/collection/allNotification.js"));
  eleventyConfig.addCollection("allTags", require("./src/system/11ty/collection/allTags.js"));
  eleventyConfig.addCollection("styleguide", require("./src/system/11ty/collection/styleguide.js"));
  eleventyConfig.addCollection("tags", require("./src/system/11ty/collection/tags"));
  eleventyConfig.addCollection("blocks", require("./src/system/11ty/collection/blocks.js"));

  // Transform
  if (env.mode == "prod") {
    eleventyConfig.addTransform("htmlmin", require("./src/system/11ty/transform/minify.js"));
  }

  // PassThrough
  eleventyConfig.addPassthroughCopy("src/themes/" + theme + "/assets/");
  eleventyConfig.addPassthroughCopy("src/service-workers.js");
  eleventyConfig.addPassthroughCopy("src/debug/");

  // global vars
  eleventyConfig.addNunjucksGlobal("saga11version", "0.5.5 beta");
  // get the theme folder name
  eleventyConfig.addNunjucksGlobal("theme", theme);

  // Local Server
  eleventyConfig.setServerOptions({
    port: 3791,
  });

  // Directory setup
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src/",
      output: "_site",
      includes: "themes/" + theme + "/includes",
      layouts: "themes/" + theme + "/layouts",
      data: "content/data",
    },
  };
};
