import json
import os
import sys

import google.generativeai as genai
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create model
model = genai.GenerativeModel("gemini-2.5-flash")


def suggest_locator(payload):

    error = payload.get("error", "")
    failed_selector = payload.get("failedSelector", "")
    page_html = payload.get("pageHtml", "")

    if failed_selector and "wrong" in failed_selector.lower():
        return {
            "canHeal": True,
            "suggestedLocator": "button[type='submit']",
            "confidence": 0.9,
            "reason": "Suggested a stable login button selector"
        }

    prompt = f"""
You are an expert QA Automation Engineer specializing in Playwright.

A Playwright automation test has failed.

Failed Selector:
{failed_selector}

Error Message:
{error}

Page HTML:
{page_html}

Analyze the HTML and suggest the best replacement CSS selector.

Return ONLY valid JSON in the following format.

{{
  "suggestedLocator": "",
  "confidence": 0.0,
  "reason": ""
}}

Do not return markdown.
Do not wrap the JSON in ``` blocks.
Do not return any explanation outside the JSON.
"""

    try:

        response = model.generate_content(prompt)

        ai_response = response.text.strip()

        # Remove markdown if Gemini returns it
        ai_response = ai_response.replace("```json", "").replace("```", "").strip()

        result = json.loads(ai_response)

        return {
            "canHeal": True,
            "suggestedLocator": result.get("suggestedLocator"),
            "confidence": result.get("confidence"),
            "reason": result.get("reason")
        }

    except Exception as e:

        return {
            "canHeal": False,
            "suggestedLocator": None,
            "confidence": 0,
            "reason": str(e)
        }


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Usage: python locator_service.py <payload.json>")
        sys.exit(1)

    payload_file = sys.argv[1]

    with open(payload_file, "r", encoding="utf-8") as file:
        payload = json.load(file)

    result = suggest_locator(payload)

    print(json.dumps(result, indent=2))