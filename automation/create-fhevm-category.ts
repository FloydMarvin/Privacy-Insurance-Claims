import * as fs from "fs";
import * as path from "path";

/**
 * @title FHEVM Category Project Generator
 * @notice CLI tool to create projects with multiple related FHEVM examples
 * @dev This script generates a complete Hardhat project containing multiple
 * example contracts grouped by category (basic, advanced, etc.)
 *
 * Unlike create-fhevm-example.ts which creates single-example repos,
 * this creates category-based projects with multiple contracts for learning
 * related concepts together.
 */

interface CategoryConfig {
  name: string;
  description: string;
  examples: ExampleInfo[];
}

interface ExampleInfo {
  contractName: string;
  description: string;
  concepts: string[];
}

/**
 * @notice Available categories with their examples
 */
const CATEGORIES: { [key: string]: CategoryConfig } = {
  basic: {
    name: "Basic FHEVM Examples",
    description: "Fundamental FHE operations: encryption, decryption, and basic arithmetic",
    examples: [
      {
        contractName: "FHECounter",
        description: "Simple encrypted counter demonstrating FHE basics",
        concepts: ["encryption", "FHE.add", "FHE.sub", "access-control"],
      },
      {
        contractName: "EncryptSingleValue",
        description: "Single value encryption with input proofs",
        concepts: ["encryption", "input-proofs", "FHE.asEuint32"],
      },
      {
        contractName: "EncryptMultipleValues",
        description: "Multiple encrypted values in one transaction",
        concepts: ["encryption", "batch-operations"],
      },
      {
        contractName: "UserDecryptSingle",
        description: "User decryption of encrypted data",
        concepts: ["user-decryption", "access-control"],
      },
    ],
  },
  advanced: {
    name: "Advanced FHEVM Examples",
    description: "Complex privacy-preserving applications and patterns",
    examples: [
      {
        contractName: "PrivacyInsuranceClaims",
        description: "Privacy-preserving insurance claims system",
        concepts: ["access-control", "encryption", "user-decryption", "state-machines"],
      },
      {
        contractName: "BlindAuction",
        description: "Sealed-bid auction with confidential bids",
        concepts: ["auction", "comparison", "encryption"],
      },
    ],
  },
};

/**
 * @notice Generate package.json for category project
 */
function generateCategoryPackageJson(category: CategoryConfig): string {
  const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");
  return JSON.stringify(
    {
      name: `fhevm-${categorySlug}`,
      version: "1.0.0",
      description: category.description,
      keywords: [
        "fhevm",
        "fhe",
        "privacy",
        "zama",
        "blockchain",
        "encryption",
        ...Array.from(new Set(category.examples.flatMap((e) => e.concepts))),
      ],
      scripts: {
        test: "hardhat test",
        compile: "hardhat compile",
        deploy: "hardhat run scripts/deploy.ts",
        "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
        clean: "hardhat clean",
        coverage: "hardhat coverage",
        lint: "eslint --ext .ts test/ scripts/",
        "lint:fix": "eslint --ext .ts test/ scripts/ --fix",
        format: 'prettier --write "test/**/*.ts" "scripts/**/*.ts" "contracts/**/*.sol"',
      },
      devDependencies: {
        "@fhevm/hardhat-plugin": "^0.3.0",
        "@nomicfoundation/hardhat-chai-matchers": "^2.0.0",
        "@nomicfoundation/hardhat-ethers": "^3.0.0",
        "@nomicfoundation/hardhat-network-helpers": "^1.0.0",
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "@typechain/ethers-v6": "^0.5.0",
        "@typechain/hardhat": "^9.0.0",
        "@types/chai": "^4.3.5",
        "@types/mocha": "^10.0.1",
        "@types/node": "^20.5.0",
        "@typescript-eslint/eslint-plugin": "^6.4.0",
        "@typescript-eslint/parser": "^6.4.0",
        chai: "^4.3.7",
        eslint: "^8.47.0",
        "eslint-config-prettier": "^9.0.0",
        "eslint-plugin-prettier": "^5.0.0",
        hardhat: "^2.19.0",
        "hardhat-gas-reporter": "^1.0.9",
        prettier: "^3.0.2",
        "prettier-plugin-solidity": "^1.1.3",
        "solidity-coverage": "^0.8.4",
        "ts-node": "^10.9.1",
        typescript: "^5.2.0",
      },
      dependencies: {
        "@fhevm/solidity": "^0.9.1",
        "@openzeppelin/contracts": "^5.0.0",
        dotenv: "^16.3.1",
        ethers: "^6.9.0",
      },
      author: "FHEVM Examples",
      license: "MIT",
      engines: {
        node: ">=18.0.0",
        npm: ">=9.0.0",
      },
    },
    null,
    2
  );
}

/**
 * @notice Generate hardhat.config.ts for category project
 */
function generateCategoryHardhatConfig(categoryName: string): string {
  return `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@fhevm/hardhat-plugin";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * @notice Hardhat Configuration for ${categoryName}
 * @dev FHEVM category project configuration
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },

  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000",
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  mocha: {
    timeout: 120000,
  },
};

export default config;
`;
}

/**
 * @notice Generate comprehensive README for category project
 */
function generateCategoryReadme(category: CategoryConfig): string {
  const examplesList = category.examples
    .map((ex) => `- **${ex.contractName}**: ${ex.description}`)
    .join("\n");

  const conceptsList = Array.from(
    new Set(category.examples.flatMap((e) => e.concepts))
  )
    .map((c) => `- ${c}`)
    .join("\n");

  return `# ${category.name}

> ${category.description}

## Overview

This project contains multiple FHEVM examples demonstrating related concepts. Each example is a standalone contract with comprehensive tests showing best practices for privacy-preserving smart contracts.

## Examples Included

${examplesList}

## Concepts Covered

${conceptsList}

## Project Structure

\`\`\`
├── contracts/              # All example contracts
${category.examples.map((ex) => `│   └── ${ex.contractName}.sol`).join("\n")}
├── test/                   # Comprehensive test suites
${category.examples.map((ex) => `│   └── ${ex.contractName}.test.ts`).join("\n")}
├── scripts/
│   └── deploy.ts          # Unified deployment script
├── hardhat.config.ts      # Hardhat configuration with FHEVM
├── package.json           # Dependencies and scripts
└── README.md              # This file
\`\`\`

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/FHECounter.test.ts

# Run with gas reporting
REPORT_GAS=true npm test
\`\`\`

### Deploy

\`\`\`bash
# Local deployment
npm run deploy

# Sepolia testnet
npm run deploy:sepolia
\`\`\`

## Key FHEVM Concepts

### Encryption

FHEVM allows you to encrypt data on-chain:

\`\`\`solidity
// Encrypt a uint32 value
euint32 encrypted = FHE.asEuint32(plainValue);
\`\`\`

### Access Control

Manage who can access encrypted data:

\`\`\`solidity
// Grant contract access
FHE.allowThis(encrypted);

// Grant user access
FHE.allow(encrypted, userAddress);
\`\`\`

### User Decryption

Users can decrypt their own data while it remains encrypted to others:

\`\`\`typescript
// Request decryption (requires permission)
const decrypted = await contract.decrypt(encryptedValue);
\`\`\`

## Example Descriptions

${category.examples
  .map(
    (ex) => `
### ${ex.contractName}

${ex.description}

**Concepts**: ${ex.concepts.join(", ")}

**Files**:
- Contract: \`contracts/${ex.contractName}.sol\`
- Tests: \`test/${ex.contractName}.test.ts\`
`
  )
  .join("\n")}

## Testing

Each example includes comprehensive tests demonstrating:
- Correct usage patterns
- Access control validation
- Error handling
- Edge cases

Run tests with verbose output:

\`\`\`bash
npx hardhat test --verbose
\`\`\`

## Security Considerations

⚠️ **Important**: These examples are for educational purposes. Before production use:

1. Conduct professional security audit
2. Review all access control mechanisms
3. Implement proper key management
4. Add monitoring and alerting
5. Consider gas optimization
6. Ensure compliance with regulations

## Learn More

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Contracts](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Zama Bounty Program](https://www.zama.ai/bounty-program)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Zama FHEVM - Making Privacy Possible**
`;
}

/**
 * @notice Generate unified deployment script for all contracts
 */
function generateCategoryDeployScript(category: CategoryConfig): string {
  return `import { ethers } from "hardhat";

/**
 * @title ${category.name} Deployment Script
 * @notice Deploys all example contracts in this category
 */
async function main() {
  console.log("🚀 Starting ${category.name} deployment...\\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\\n");

  const deployedContracts: { [key: string]: string } = {};

  ${category.examples
    .map(
      (ex) => `
  // Deploy ${ex.contractName}
  console.log("⏳ Deploying ${ex.contractName}...");
  const ${ex.contractName} = await ethers.getContractFactory("${ex.contractName}");
  const ${ex.contractName.toLowerCase()} = await ${ex.contractName}.deploy();
  await ${ex.contractName.toLowerCase()}.waitForDeployment();
  const ${ex.contractName.toLowerCase()}Address = await ${ex.contractName.toLowerCase()}.getAddress();
  deployedContracts["${ex.contractName}"] = ${ex.contractName.toLowerCase()}Address;
  console.log("✅ ${ex.contractName} deployed to:", ${ex.contractName.toLowerCase()}Address);
  `
    )
    .join("\n")}

  console.log("\\n📋 Deployment Summary:");
  console.log("═══════════════════════════════════════════════════════");
  for (const [name, address] of Object.entries(deployedContracts)) {
    console.log(\`\${name.padEnd(30)} : \${address}\`);
  }
  console.log("═══════════════════════════════════════════════════════");

  console.log("\\n✨ All contracts deployed successfully!");

  return deployedContracts;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
`;
}

/**
 * @notice Create template files common to all projects
 */
const TEMPLATE_FILES: { [key: string]: string } = {
  ".gitignore": `# Dependencies
node_modules/
npm-debug.log*

# Hardhat
cache/
artifacts/
typechain-types/
coverage/
coverage.json
gas-report

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
`,

  ".env.example": `# Private Key for Deployment
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Gas Reporting
REPORT_GAS=false
`,

  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "commonjs",
        lib: ["ES2022"],
        declaration: true,
        strict: false,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: "node",
        outDir: "./dist",
        rootDir: "./",
        typeRoots: ["./node_modules/@types", "./typechain-types"],
        types: ["node"],
      },
      include: ["./test/**/*.ts", "./scripts/**/*.ts", "./hardhat.config.ts"],
      exclude: ["node_modules", "artifacts", "cache", "coverage", "dist"],
    },
    null,
    2
  ),
};

/**
 * @notice Create a category-based FHEVM project
 */
async function createCategoryProject(
  categoryKey: string,
  outputDir: string
): Promise<void> {
  const category = CATEGORIES[categoryKey];
  if (!category) {
    throw new Error(
      `Category "${categoryKey}" not found. Available: ${Object.keys(CATEGORIES).join(", ")}`
    );
  }

  const projectDir = path.join(
    outputDir,
    category.name.toLowerCase().replace(/\s+/g, "-")
  );

  console.log(`\n🚀 Creating Category Project: ${category.name}`);
  console.log(`📁 Output directory: ${projectDir}\n`);

  // Create directory structure
  const dirs = [
    projectDir,
    path.join(projectDir, "contracts"),
    path.join(projectDir, "test"),
    path.join(projectDir, "scripts"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${path.relative(outputDir, dir)}`);
    }
  }

  // Create template files
  for (const [filename, content] of Object.entries(TEMPLATE_FILES)) {
    const filePath = path.join(projectDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`✓ Created: ${filename}`);
  }

  // Create package.json
  const packageJson = generateCategoryPackageJson(category);
  fs.writeFileSync(path.join(projectDir, "package.json"), packageJson);
  console.log(`✓ Created: package.json`);

  // Create hardhat.config.ts
  const hardhatConfig = generateCategoryHardhatConfig(category.name);
  fs.writeFileSync(path.join(projectDir, "hardhat.config.ts"), hardhatConfig);
  console.log(`✓ Created: hardhat.config.ts`);

  // Create README
  const readme = generateCategoryReadme(category);
  fs.writeFileSync(path.join(projectDir, "README.md"), readme);
  console.log(`✓ Created: README.md`);

  // Create deploy script
  const deployScript = generateCategoryDeployScript(category);
  fs.writeFileSync(path.join(projectDir, "scripts", "deploy.ts"), deployScript);
  console.log(`✓ Created: scripts/deploy.ts`);

  console.log(`\n✨ Category project created successfully!`);
  console.log(`\n📝 Next steps:`);
  console.log(`  1. cd ${path.relative(process.cwd(), projectDir)}`);
  console.log(`  2. npm install`);
  console.log(
    `  3. Add contract files to contracts/ (${category.examples.length} contracts needed)`
  );
  console.log(
    `  4. Add test files to test/ (${category.examples.length} test files needed)`
  );
  console.log(`  5. npm test`);
  console.log(`\n📚 Examples to implement:`);
  category.examples.forEach((ex, i) => {
    console.log(`  ${i + 1}. ${ex.contractName} - ${ex.description}`);
  });
}

/**
 * @notice CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const categoryKey = args[0];
  const outputDir = args[1] || path.join(process.cwd(), "output");

  if (!categoryKey) {
    console.log("📚 Available Categories:\n");
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      console.log(`  ${key.padEnd(15)} - ${cat.name}`);
      console.log(`  ${" ".repeat(17)} ${cat.description}`);
      console.log(`  ${" ".repeat(17)} (${cat.examples.length} examples)\n`);
    });
    console.log("\nUsage: ts-node create-fhevm-category.ts <category> [output-dir]");
    console.log("Example: ts-node create-fhevm-category.ts basic ./output\n");
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await createCategoryProject(categoryKey, outputDir);

  console.log("\n💡 Pro Tip:");
  console.log("   You can copy example contracts from the parent project");
  console.log("   or reference the Zama examples repository!\n");
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error creating category project:");
    console.error(error);
    process.exit(1);
  });
}

export { createCategoryProject, CATEGORIES };
