import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export const fetchJDFromLink = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent;

    return text.replace(/\s+/g, " ").trim();
  } catch (err) {
    throw new Error("Unable to fetch Job Description from link");
  }
};
