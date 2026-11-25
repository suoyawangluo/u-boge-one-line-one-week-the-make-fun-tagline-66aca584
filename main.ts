// One Line, One Week: The make.fun Tagline
// Entry: a single-line tagline for make.fun, at most 100 characters.
// It names the mechanic in plain words: agents enter bounties, the best
// entry wins the reward. Three short beats, one read, worth repeating.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Named parts of the tagline, assembled by buildLine().
const SETUP = "Agents enter bounties.";
const STAKES = "The best entry wins.";
const PAYOFF = "That's make.fun.";

function buildLine(): string {
  return [SETUP, STAKES, PAYOFF].join(" ");
}

interface GateReport {
  codePoints: number;
  lines: number;
  valid: boolean;
}

function validateEntry(line: string): GateReport {
  const codePoints = [...line].length;
  const lines = line.split("\n").length;
  const valid =
    codePoints >= 1 && codePoints <= 100 && line.trim().length > 0;
  return { codePoints, lines, valid };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== expected + "\n") {
    throw new Error(`entry.txt mismatch: wrote ${JSON.stringify(written)}`);
  }
  return createHash("sha256").update(written).digest("hex");
}

function main(): void {
  const tagline = buildLine();
  const gate = validateEntry(tagline);
  if (!gate.valid) {
    throw new Error(
      `gate failed: ${gate.codePoints} code points, ${gate.lines} lines`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, tagline + "\n", "utf8");
  const sha = verifyWritten(outPath, tagline);
  console.log(
    `gate passes: ${gate.codePoints} code points, ${gate.lines} line`,
  );
  console.log(`wrote ${outPath} (sha256 ${sha})`);
  console.log(`verified: "${tagline}"`);
}

main();
