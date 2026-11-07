import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "./app.js";

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise((r) => server.close(r)));

const post = (body: unknown) =>
  fetch(`${base}/simulate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /simulate", () => {
  it("runs card code with default transaction values", async () => {
    const code = encodeURI(`
      const beforeTransaction = async (auth) => { console.log(auth.merchant.name); return auth.centsAmount < 50000; };
      const afterTransaction = async () => { console.log("approved"); };
      const afterDecline = async () => { console.log("declined"); };
    `);
    const res = await post({ code });
    expect(res.status).toBe(200);
    const items = await res.json();
    expect(items).toHaveLength(2);
    expect(items[0].authorizationApproved).toBe(true);
    expect(items[0].logs[0].content).toContain("The Bakery");
    expect(items[1].type).toBe("after_transaction");
  });

  it("declines when beforeTransaction returns false", async () => {
    const code = encodeURI(`
      const beforeTransaction = async () => false;
      const afterTransaction = async () => {};
      const afterDecline = async () => { console.log("declined"); };
    `);
    const items = await (await post({ code, transaction: { centsAmount: 999999 } })).json();
    expect(items[0].authorizationApproved).toBe(false);
    expect(items[1].type).toBe("after_decline");
  });

  it("rejects a request without code", async () => {
    const res = await post({ transaction: {} });
    expect(res.status).toBe(400);
  });

  it("rejects malformed URI-encoded code", async () => {
    const res = await post({ code: "%E0%A4%A" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON bodies", async () => {
    const res = await fetch(`${base}/simulate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    expect(res.status).toBe(400);
  });
});
