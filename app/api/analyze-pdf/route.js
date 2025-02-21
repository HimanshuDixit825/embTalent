import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert at analyzing job descriptions and extracting required skills. You must respond with ONLY a valid JSON object, exactly as shown in the example below. Do not include any additional text, explanations, or formatting.

TASK:
Analyze the provided job description PDF and extract:
1. Must-have technical skills (core requirements)
2. Good-to-have technical skills (optional/preferred skills)

GUIDELINES:
- Focus on technical skills and technologies
- Include specific versions/frameworks where mentioned
- Consider both explicit requirements and implied skills
- Look for phrases indicating optional skills:
  * "nice to have"
  * "preferred"
  * "a plus"
  * "beneficial"
  * "ideally"

EXAMPLE RESPONSE:
{
    "skills": {
        "mustHave": ["JavaScript", "React", "Node.js"],
        "goodToHave": ["TypeScript", "AWS", "Docker"]
    }
}

IMPORTANT:
1. Your response must be ONLY the JSON object
2. Do not include any text before or after the JSON
3. Do not include any explanations or notes
4. Both mustHave and goodToHave arrays must be present
5. Arrays can be empty but must exist
6. Each skill must be a string
7. Use proper JSON formatting with double quotes
8. Make sure to add not more than 5 skills in mustHave and goodToHave skills in json. 
`;

export async function POST(request) {
  try {
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Send to Claude for analysis
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                media_type: "application/pdf",
                type: "base64",
                data: base64,
              },
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: "Extract the must-have and good-to-have skills from this job description. Respond with ONLY the JSON object.",
            },
          ],
        },
      ],
    });

    // Get the response text
    const text = response.content[0].text.trim();

    try {
      // Parse the response
      const analysis = JSON.parse(text);

      // Validate the structure
      if (
        !analysis.skills?.mustHave ||
        !analysis.skills?.goodToHave ||
        !Array.isArray(analysis.skills.mustHave) ||
        !Array.isArray(analysis.skills.goodToHave)
      ) {
        console.error("Invalid response structure:", text);
        throw new Error("Invalid response structure");
      }

      // Validate that all items are strings
      if (
        !analysis.skills.mustHave.every((item) => typeof item === "string") ||
        !analysis.skills.goodToHave.every((item) => typeof item === "string")
      ) {
        console.error("Invalid skill type:", text);
        throw new Error("Invalid skill type");
      }

      // Return the analysis
      return NextResponse.json({ analysis });
    } catch (parseError) {
      console.error("Failed to parse Claude response:", text);
      return NextResponse.json(
        { error: "Failed to parse analysis results" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze PDF" },
      { status: 500 }
    );
  }
}
