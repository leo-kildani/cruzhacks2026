const URLS = [
  "http://rss.cnn.com/rss/cnn_us.rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
  "https://moxie.foxnews.com/google-publisher/politics.xml",
  "https://abcnews.go.com/abcnews/usheadlines",
  "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
  "https://www.latimes.com/nation/rss2.0.xml",
];

import Parser from "rss-parser";

type CustomFeed = { foo: string };
type CustomItem = { bar: number };

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: ["foo"],
    item: ["bar"],
  },
});

(async () => {
  for (const url of URLS) {
    const feed = await parser.parseURL(url);
    console.log(feed.title);

    let counter = 0;
    feed.items.forEach((item) => {
      console.log(
        `${counter}.\nTitle: ${item.title}\nLink: ${item.link}\nDescription: ${item.content}\nPublished: ${item.pubDate}\n\n`
      );
      counter++;
    });
  }
})();
