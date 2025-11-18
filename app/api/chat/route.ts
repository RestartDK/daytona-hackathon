import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type Decision = "yes" | "no" | "idk";

const systemPath = path.join(process.cwd(), "internal", "system-prompt.md");
const compliancePath = path.join(
  process.cwd(),
  "internal",
  "internal-complience.md",
);

async function loadText(filePath: string) {
  return fs.readFile(filePath, "utf8");
}

function structureQuestion(question: string) {
  const normalized = question.trim();
  const upperTicker = normalized.match(/\b[A-Z]{2,5}\b/);
  const action = /sell|short/i.test(normalized)
    ? "sell"
    : /buy|purchase/i.test(normalized)
      ? "buy"
      : "unsure";

  return {
    action,
    ticker: upperTicker?.[0] ?? null,
    raw: normalized,
  };
}

export const POST = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const question: string | undefined = body.question ?? body.text;
    const position: string = body.position ?? "Financial Advisor";
    const company: string = body.company ?? "Goldman Sacks";

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 },
      );
    }

    const [systemPrompt, complianceText] = await Promise.all([
      loadText(systemPath),
      loadText(compliancePath),
    ]);

    const structured = structureQuestion(question);

    const system = [
      systemPrompt.trim(),
      "",
      `Firm-specific compliance notes for ${company}:`,
      complianceText.trim(),
      "",
      `Employee role: ${position}`,
      "You will be given a structured representation of the user's question.",
      'Respond ONLY in JSON: {"decision":"yes|no|idk","reason":"short human explanation","uiCopy":"one sentence to show user"}',
    ].join("\n");

    const userContent = `Structured question: ${JSON.stringify(structured)}`;

    const result = await generateText({
      model: google("gemini-2.0-flash-lite"),
      system,
      prompt: userContent,
      temperature: 0.35,
      maxOutputTokens: 400,
    });

    let parsed: { decision?: Decision; reason?: string; uiCopy?: string } = {};
    try {
      parsed = JSON.parse(result.text);
    } catch {
      parsed = {};
    }

    return NextResponse.json({
      structured,
      raw: result.text,
      decision: parsed.decision,
      reason: parsed.reason,
      uiCopy: parsed.uiCopy,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};
