import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, safeHref, renderPortfolio } from "./render-content.mjs";
import { portfolio } from "../content.js";

test("editorial markup cannot inject HTML or active URL schemes", () => {
  assert.equal(
    escapeHtml('<img src="x" onerror="alert(1)">'),
    "&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;",
  );
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//example.com",
    "/assets/a\n.js",
  ]) {
    assert.throws(() => safeHref(url));
  }
  assert.equal(
    safeHref("https://example.com/?a=1&b=2"),
    "https://example.com/?a=1&amp;b=2",
  );
});

test("delivered HTML preserves professional destinations and unique section targets", () => {
  const html = renderPortfolio();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.indexOf('id="experience"') < html.indexOf('id="projects"'));
  assert.ok(html.indexOf('id="projects"') < html.indexOf('id="research"'));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const href of [...html.matchAll(/href="#([^"]+)"/g)].map(
    (match) => match[1],
  )) {
    assert.ok(ids.includes(href), `Missing target: ${href}`);
  }
  for (const project of portfolio.projects.items) {
    for (const link of project.links)
      assert.ok(
        html.includes(safeHref(link.href)),
        `Missing project link: ${link.href}`,
      );
  }
  assert.ok(html.includes(safeHref(portfolio.meta.resumeUrl)));
  for (const role of portfolio.work.items)
    assert.ok(html.includes(escapeHtml(role.role)));
  for (const paper of portfolio.hero.featuredPublication.items)
    assert.ok(html.includes(safeHref(paper.href)));
});
