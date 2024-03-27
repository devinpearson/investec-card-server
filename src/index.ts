import express, { Express, Request, Response } from "express";
import cors from 'cors'
import dotenv from "dotenv";
import bodyParser from 'body-parser'
import { run, createTransaction, ExecutionItem } from 'programmable-card-code-emulator'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Card Code Execution Server");
});

app.post("/simulate", async (req: Request, res: Response) => {
    const body = req.body
    // console.log(decodeURI(body.code))
    const code = decodeURI(body.code)
    const currencyCode = body.transaction.currencyCode ?? 'zar'
    const centsAmount = body.transaction.centsAmount ?? 10000
    const merchantCode = body.transaction.merchantCode ?? '0000'
    const merchantName = body.transaction.merchantName ?? 'The Backery'
    const merchantCity = body.transaction.merchantCity ?? 'Cape Town'
    const merchantCountry = body.transaction.merchantCountry ?? 'ZA'
    const transaction = createTransaction(currencyCode, centsAmount, merchantCode, merchantName, merchantCity, merchantCountry);
    const executionItems = await run(transaction, code, "{}");

    res.json(executionItems);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});