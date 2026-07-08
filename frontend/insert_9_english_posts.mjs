import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const posts = [
  {
    title: "1. What is MCP (Model Context Protocol)? Why is it Important?",
    content: `In the Agentic AI space, the term MCP (Model Context Protocol) is frequently discussed. Naturally, AI models are like scholars who grew up reading books in a closed room without internet access. They possess vast knowledge but cannot know what is happening in the outside world or access files on your computer. MCP was introduced to resolve this issue.

**What is MCP?**
MCP is an open standard protocol introduced by Anthropic, acting as a secure bridge between AI models and external data sources (e.g., local files, databases, APIs, Slack, GitHub, etc.). Just like a USB Type-C cable connects phones, laptops, and monitors, MCP helps AI connect with various data sources in a standardized way.

**Why is it Important?**
Previously, connecting an AI to a database required writing custom APIs. Now, setting up an MCP server for a database allows any AI client (e.g., Claude Desktop, Cursor, or custom agents) to easily query and utilize that data.

**Security & The Future**
Another key benefit of MCP is security. Instead of granting an AI access to scan your entire machine, MCP limits access to specific folders or database tables. Utilizing a client-server architecture, it is highly secure. Moving forward, agentic AI will rely heavily on the MCP ecosystem to solve complex tasks.`,
    mood: "mindblown",
    tags: ["ai", "mcp", "database", "security"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "2. Deep Dive into Agentic AI Skills",
    content: `When discussing Agentic AI, 'Skill' is a term commonly used. Just as humans have skills like driving or cooking, AI has skills tailored to perform specific tasks.

**What is a Skill?**
A skill is different from a simple tool (like a calculator). A skill is a package combining tools, knowledge, and execution logic. For instance, if an AI is given a 'Data Analyst Skill', it includes tools to write Python code, query databases, and visualize data.

**How are Skills Built?**
Skills for Agentic AI are constructed by combining prompting techniques, Retrieval-Augmented Generation (RAG), and API integrations. The AI is trained on step-by-step procedures (Standard Operating Procedures - SOPs) to ensure consistency.

**Human vs. AI Skills**
While humans take months or years to learn a skill, an Agentic AI can install a skill plugin and instantly master it. Adding an 'Email Marketing Skill' allows the agent to read emails, prioritize them, and draft replies immediately.

In the future, instead of buying software, users will buy skills from stores to upgrade their AI assistants.`,
    mood: "focused",
    tags: ["ai", "skills", "performance"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "3. Multi-Agent Systems and the Role of Sub-agents",
    content: `Managing a large project alone is difficult and error-prone. Similarly, handing all tasks to a single AI agent can lead to context limits and logical confusion. Sub-agents help resolve this problem.

**What is a Sub-agent?**
Sub-agents are specialized assistants spawned by a main orchestrator to handle specific sub-tasks, similar to how a CEO delegates tasks to department managers.

**How do Sub-agents Work?**
For example, to build a web application:
1. Product Manager Agent (Main) analyzes requirements.
2. UI/UX Designer Sub-agent draws the mockups.
3. Frontend Developer Sub-agent writes the code.
4. QA Tester Sub-agent tests for errors.
Each sub-agent focuses on its domain and returns results to the main agent.

**Why use Sub-agents?**
* **Specialization:** Sub-agents operate with dedicated prompts and tools.
* **Parallelism:** Tasks are run concurrently to save time.
* **Context Management:** Reduces hallucinations by limiting the information scope of each agent.
Multi-agent architecture is the backbone of modern Agentic AI.`,
    mood: "happy",
    tags: ["ai", "sub-agent", "optimization", "react"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "4. AI Instruments: Understanding Tools",
    content: `Standard LLMs only output text. They cannot browse the web, write files, or send emails on their own. Agentic AI uses 'Tools' to perform actions in the real world.

**What is a Tool?**
A tool is a function or API registered with the AI. Examples include:
* **Web Search Tool:** Fetches real-time information.
* **File System Tool:** Reads and writes local files.
* **Calculator Tool:** Performs complex mathematical computations.
* **Code Execution Tool:** Executes code to debug errors.

**How do Tools Work?**
The AI decides which tool to use. For example, if asked 'What is the weather in Yangon?', the AI invokes its weather API tool and parses the returned result to draft a final response.

**The Role of Function Calling**
For tools to work, LLMs must support 'Function Calling' to understand tool schemas and format arguments correctly. Tools empower AI to solve practical real-world problems.`,
    mood: "focused",
    tags: ["ai", "tool", "tailwindcss", "ui"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "5. The Importance of Resources for Agents",
    content: `Just as chefs need knives (tools) and ingredients (resources) to cook, Agentic AI needs both tools and resources to perform tasks.

**What is a Resource?**
Resources are the data inputs read by the agent, such as:
* Text files, PDFs, and documents.
* Database records.
* JSON payloads from APIs.
Using protocols like MCP, agents dynamically pull and process these raw materials to complete tasks.`,
    mood: "focused",
    tags: ["ai", "resource", "optimization"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "6. Governing AI: Rules and Prompts",
    content: `System prompts define the operational boundaries of an agent. They specify the persona, strict rules, and target tasks to ensure safe and predictable behavior.

**Prompt Design**
A high-quality prompt contains clear formatting rules, exceptions, and instructions for human-in-the-loop triggers if the agent encounters high-risk operations.`,
    mood: "happy",
    tags: ["ai", "prompt", "security"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "7. Memory Systems in Agentic AI",
    content: `Standard chatbots lose context once the session ends. Agentic AI features short-term memory (session history) and long-term memory (storing past experiences in vector databases) to learn and evolve over time.`,
    mood: "excited",
    tags: ["ai", "memory", "database"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "8. State Tracking with Checkpointers",
    content: `Checkpointers log the state of an agent at every execution step. If an error occurs, the agent can recover from the last saved state rather than restarting the entire task from scratch.`,
    mood: "mindblown",
    tags: ["ai", "checkpointer", "optimization"],
    user_id: "00000000-0000-0000-0000-000000000000"
  },
  {
    title: "9. Securing Execution with a Harness",
    content: `An execution harness defines the secure sandbox environment where an agent operates, restricting access to approved commands and prompting human approval before executing sensitive scripts.`,
    mood: "excited",
    tags: ["ai", "harness", "security"],
    user_id: "00000000-0000-0000-0000-000000000000"
  }
];

async function seedNinePosts() {
  console.log("🌱 Seeding 9 detailed Agentic AI posts in English to Supabase...");
  
  let successCount = 0;
  for (const post of posts) {
    const { data, error } = await supabase.from("daily_logs").insert({ ...post, locale: "en" }).select();
    if (error) {
      console.error(`❌ Error inserting log: "${post.title}"`, error.message);
    } else {
      console.log(`Successfully inserted: "${post.title}"`);
      successCount++;
    }
  }
  
  console.log(`🎉 Done! Successfully inserted ${successCount}/${posts.length} posts.`);
}

seedNinePosts();
