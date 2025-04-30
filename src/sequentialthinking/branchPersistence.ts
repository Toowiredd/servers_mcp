import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface Branch {
  id: string;
  thoughts: string[];
  metadata?: Record<string, any>;
}

class BranchPersistence {
  private branches: Branch[] = [];

  createBranch(id: string, metadata?: Record<string, any>): void {
    if (this.branches.find(branch => branch.id === id)) {
      throw new Error(`Branch with id ${id} already exists.`);
    }
    this.branches.push({ id, thoughts: [], metadata });
  }

  addThoughtToBranch(branchId: string, thought: string): void {
    const branch = this.branches.find(branch => branch.id === branchId);
    if (!branch) {
      throw new Error(`Branch with id ${branchId} not found.`);
    }
    branch.thoughts.push(thought);
  }

  getBranch(branchId: string): Branch | undefined {
    return this.branches.find(branch => branch.id === branchId);
  }

  listBranches(): Branch[] {
    return this.branches;
  }

  deleteBranch(branchId: string): void {
    this.branches = this.branches.filter(branch => branch.id !== branchId);
  }

  mergeBranch(branchId: string): void {
    const branch = this.getBranch(branchId);
    if (!branch) {
      throw new Error(`Branch with id ${branchId} not found.`);
    }
    // Assuming merging means adding thoughts to the main branch
    const mainBranch = this.getBranch('main');
    if (!mainBranch) {
      throw new Error(`Main branch not found.`);
    }
    mainBranch.thoughts.push(...branch.thoughts);
    this.deleteBranch(branchId);
  }

  visualizeBranch(branchId: string): string {
    const branch = this.getBranch(branchId);
    if (!branch) {
      throw new Error(`Branch with id ${branchId} not found.`);
    }
    return branch.thoughts.join(' -> ');
  }

  updateBranchMetadata(branchId: string, metadata: Record<string, any>): void {
    const branch = this.getBranch(branchId);
    if (!branch) {
      throw new Error(`Branch with id ${branchId} not found.`);
    }
    branch.metadata = metadata;
  }
}

const BRANCH_PERSISTENCE_TOOL: Tool = {
  name: "branchPersistence",
  description: "A tool for managing branches and their thoughts.",
  inputSchema: {
    type: "object",
    properties: {
      branchId: { type: "string", description: "The ID of the branch" },
      thought: { type: "string", description: "The thought to add to the branch" },
    },
    required: ["branchId", "thought"],
  },
};

export { BranchPersistence, BRANCH_PERSISTENCE_TOOL };
