import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface Thought {
  id: string;
  content: string;
  timestamp: Date;
  userId: string;
  category?: string;
}

class ThoughtPipeline {
  private thoughts: Thought[] = [];

  addThought(thought: Thought): void {
    this.thoughts.push(thought);
  }

  getThoughts(): Thought[] {
    return this.thoughts;
  }

  getThoughtById(id: string): Thought | undefined {
    return this.thoughts.find(thought => thought.id === id);
  }

  removeThoughtById(id: string): void {
    this.thoughts = this.thoughts.filter(thought => thought.id !== id);
  }

  validateThought(thought: Thought): void {
    if (!thought.id || !thought.content || !thought.timestamp || !thought.userId) {
      throw new Error("Invalid thought: missing required fields");
    }
  }

  formatThought(thought: Thought): string {
    return `${thought.timestamp.toISOString()} - ${thought.userId}: ${thought.content}`;
  }

  categorizeThought(thought: Thought, category: string): void {
    const targetThought = this.getThoughtById(thought.id);
    if (targetThought) {
      targetThought.category = category;
    }
  }

  searchThoughts(keyword: string): Thought[] {
    return this.thoughts.filter(thought => thought.content.includes(keyword));
  }
}

const THOUGHT_PIPELINE_TOOL: Tool = {
  name: "thoughtPipeline",
  description: "A tool for managing a pipeline of thoughts.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The ID of the thought" },
      content: { type: "string", description: "The content of the thought" },
      timestamp: { type: "string", format: "date-time", description: "The timestamp of the thought" },
      userId: { type: "string", description: "The ID of the user who created the thought" },
      category: { type: "string", description: "The category of the thought" },
    },
    required: ["id", "content", "timestamp", "userId"],
  },
};

export { ThoughtPipeline, THOUGHT_PIPELINE_TOOL };
