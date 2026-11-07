import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { run, createTransaction } from "programmable-card-code-emulator";

type TransactionInput = {
  currencyCode?: string;
  centsAmount?: number;
  merchantCode?: string;
  merchantName?: string;
  merchantCity?: string;
  merchantCountry?: string;
};

export function createApp(): Express {
  const app = express();

  app.use(cors());
  if (process.env.NODE_ENV !== "test") app.use(morgan("combined"));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (_req: Request, res: Response) => {
    res.send("Card Code Execution Server");
  });

  app.post("/simulate", async (req: Request, res: Response) => {
    const body = req.body ?? {};

    if (typeof body.code !== "string" || body.code.length === 0) {
      res.status(400).json({ error: "`code` must be a non-empty string" });
      return;
    }

    let code: string;
    try {
      code = decodeURI(body.code);
    } catch {
      res.status(400).json({ error: "`code` is not valid URI-encoded text" });
      return;
    }

    const tx: TransactionInput = body.transaction ?? {};
    const centsAmount = Number(tx.centsAmount ?? 10000);
    if (!Number.isFinite(centsAmount)) {
      res.status(400).json({ error: "`transaction.centsAmount` must be a number" });
      return;
    }

    const env = body.environmentVariables ?? {};
    const transaction = createTransaction(
      tx.currencyCode ?? "zar",
      centsAmount,
      tx.merchantCode ?? "0000",
      tx.merchantName ?? "The Bakery",
      tx.merchantCity ?? "Cape Town",
      tx.merchantCountry ?? "ZA",
    );

    const executionItems = await run(
      transaction,
      code,
      typeof env === "string" ? env : JSON.stringify(env),
    );
    res.json(executionItems);
  });

  // Express 5 forwards rejected async handlers here.
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = (err as { status?: number }).status ?? 500;
    res.status(status).json({ error: status === 500 ? "Internal server error" : err.message });
  });

  return app;
}
