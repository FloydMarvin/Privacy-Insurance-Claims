# Developer Guide

> **Comprehensive guide for maintaining, extending, and contributing to FHEVM examples**

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Adding New Examples](#adding-new-examples)
4. [Updating Dependencies](#updating-dependencies)
5. [Testing Strategy](#testing-strategy)
6. [Documentation Generation](#documentation-generation)
7. [Deployment Guide](#deployment-guide)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd PrivacyInsuranceClaims

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests to verify setup
npm test
```

### Development Workflow

```bash
# Start local Hardhat node (in separate terminal)
npx hardhat node

# Deploy contracts locally
npm run deploy

# Run tests with coverage
npm run coverage

# Lint and format code
npm run lint
npm run format
```

## Project Architecture

### Directory Structure

```
PrivacyInsuranceClaims/
├── contracts/                  # Solidity smart contracts
│   └── PrivacyInsuranceClaims.sol
├── test/                       # TypeScript test files
│   └── PrivacyInsuranceClaims.test.ts
├── scripts/                    # Deployment and utility scripts
│   └── deploy.ts
├── automation/                 # Example and docs generators
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   └── generate-docs.ts
├── docs/                       # Auto-generated documentation
│   ├── SUMMARY.md
│   ├── access-control.md
│   ├── encryption.md
│   └── user-decryption.md
├── hardhat.config.ts          # Hardhat configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Main documentation
```

### Key Components

#### 1. Smart Contracts (`contracts/`)

All FHEVM contracts go here. Each contract should:
- Use `@fhevm/solidity` library for FHE operations
- Include comprehensive NatSpec comments
- Implement proper access control
- Handle encrypted data correctly

#### 2. Tests (`test/`)

Test files should:
- Use JSDoc annotations for documentation generation
- Include `@title`, `@notice`, `@dev`, `@chapter` tags
- Cover all contract functions
- Test both success and failure cases
- Include edge case testing

#### 3. Automation Tools (`automation/`)

Scripts for:
- Generating new example repositories
- Creating category-based projects
- Auto-generating documentation from test comments

## Adding New Examples

### Step 1: Create the Contract

Create a new Solidity file in `contracts/`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title YourExampleContract
 * @notice Brief description of what this contract does
 * @dev Detailed technical notes about implementation
 */
contract YourExampleContract is SepoliaConfig {
    // Your contract code here
}
```

### Step 2: Write Comprehensive Tests

Create corresponding test file in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @title YourExample Test Suite
 * @notice Tests for YourExampleContract
 * @dev Demonstrates FHEVM concepts: encryption, access control, etc.
 * @chapter encryption
 * @chapter access-control
 */
describe("YourExampleContract", function () {
  /**
   * @notice Test case description
   * @dev Technical details about what's being tested
   */
  it("Should do something specific", async function () {
    // Test implementation
  });
});
```

### Step 3: Update Automation Scripts

Add your example to `automation/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP = {
  "your-example": {
    contractName: "YourExampleContract",
    description: "Brief description",
    chapters: ["encryption", "access-control"],
  },
  // ... other examples
};
```

### Step 4: Generate Documentation

```bash
npm run generate:docs
```

This will:
- Parse JSDoc comments from your tests
- Generate chapter markdown files
- Update the documentation index

### Step 5: Test Your Example

```bash
# Compile
npm run compile

# Run specific test
npx hardhat test test/YourExample.test.ts

# Generate standalone repo (optional)
npx ts-node automation/create-fhevm-example.ts your-example ./output
```

## Updating Dependencies

### When FHEVM Updates

When `@fhevm/solidity` releases a new version:

#### 1. Update package.json

```bash
npm install @fhevm/solidity@latest
npm install @fhevm/hardhat-plugin@latest
```

#### 2. Update Contracts

Check for breaking changes:
- Review FHEVM changelog
- Update import statements if needed
- Adjust FHE function calls if API changed

```solidity
// Old (example)
import { FHE } from "fhevm/FHE.sol";

// New
import { FHE } from "@fhevm/solidity/lib/FHE.sol";
```

#### 3. Update Hardhat Config

Ensure plugin imports are correct:

```typescript
import "@fhevm/hardhat-plugin";
```

#### 4. Test All Examples

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Test each example individually
npx hardhat test test/PrivacyInsuranceClaims.test.ts
```

#### 5. Update Documentation

```bash
# Regenerate all docs
npm run generate:docs

# Update README with any new patterns
# Update DEVELOPER_GUIDE.md with changes
```

### Dependency Update Checklist

- [ ] Update package.json versions
- [ ] Run `npm install`
- [ ] Update contract imports
- [ ] Update test files if needed
- [ ] Run all tests - ensure they pass
- [ ] Check for deprecation warnings
- [ ] Update documentation
- [ ] Test generated examples
- [ ] Commit changes with clear message

## Testing Strategy

### Test Structure

Organize tests by functionality:

```typescript
describe("Contract Name", function () {
  describe("Feature Category", function () {
    beforeEach(async function () {
      // Setup for this category
    });

    it("Should test specific behavior", async function () {
      // Test implementation
    });
  });
});
```

### Coverage Goals

Aim for:
- **Statement coverage**: >80%
- **Branch coverage**: >75%
- **Function coverage**: 100%
- **Line coverage**: >85%

### Test Best Practices

#### ✅ DO:

```typescript
// Clear, descriptive test names
it("Should reject claim submission without active policy", async function () {
  // Clear test logic
});

// Test both success and failure
it("Should create policy with valid parameters", async function () {});
it("Should reject policy with zero premium", async function () {});

// Use proper assertions
expect(result).to.equal(expected);
expect(tx).to.emit(contract, "EventName");
```

#### ❌ DON'T:

```typescript
// Vague test names
it("Should work", async function () {});

// Testing multiple things in one test
it("Should create policy and submit claim and process payment", async function () {});

// Ignoring error cases
// Always test failure paths!
```

### Running Tests

```bash
# All tests
npm test

# Specific file
npx hardhat test test/PrivacyInsuranceClaims.test.ts

# With gas reporting
REPORT_GAS=true npm test

# With coverage
npm run coverage

# Verbose output
npx hardhat test --verbose
```

## Documentation Generation

### Documentation System

The project uses automated documentation generation from JSDoc comments in test files.

### JSDoc Tags

Use these tags in test comments:

- `@title` - Section title
- `@notice` - Brief description for users
- `@dev` - Technical details for developers
- `@chapter` - Which documentation chapter this belongs to

### Example

```typescript
/**
 * @title Access Control Tests
 * @notice Tests for managing authorized reviewers
 * @dev Demonstrates role-based access control patterns
 * @chapter access-control
 */
describe("Reviewer Management", function () {
  /**
   * @notice Should add authorized reviewer
   * @dev Only insurance company can add reviewers
   */
  it("Should add reviewer by insurance company", async function () {
    // Test code
  });
});
```

### Generating Documentation

```bash
# Generate docs for current project
npm run generate:docs

# Or directly
npx ts-node automation/generate-docs.ts

# Generate for specific directory
npx ts-node automation/generate-docs.ts /path/to/project
```

### Documentation Output

Generated files:
- `README.md` - Comprehensive project guide
- `docs/SUMMARY.md` - GitBook table of contents
- `docs/access-control.md` - Access control chapter
- `docs/encryption.md` - Encryption chapter
- `docs/user-decryption.md` - User decryption chapter

### GitBook Integration

The generated docs are GitBook-compatible:

1. Create GitBook project
2. Connect to your repository
3. Point to `docs/` folder
4. GitBook will use `SUMMARY.md` for navigation

## Deployment Guide

### Local Deployment

```bash
# Start Hardhat node
npx hardhat node

# In another terminal, deploy
npm run deploy
```

### Testnet Deployment

#### 1. Setup Environment

Create `.env` file:

```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 2. Get Test ETH

Get Sepolia ETH from faucets:
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

#### 3. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

#### 4. Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Deployment Script

The deploy script should:
- Check deployer balance
- Deploy contract
- Verify deployment
- Log contract address
- Save deployment info

Example `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Contract = await ethers.getContractFactory("ContractName");
  const contract = await Contract.deploy(/* constructor args */);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Best Practices

### Solidity Best Practices

#### 1. Use Explicit Type Conversions

```solidity
// ✅ Good
euint32 encrypted = FHE.asEuint32(plainValue);

// ❌ Bad - implicit conversion might fail
euint32 encrypted = plainValue;
```

#### 2. Always Set Access Control

```solidity
// ✅ Good - both permissions
FHE.allowThis(encrypted);
FHE.allow(encrypted, user);

// ❌ Bad - missing allowThis
FHE.allow(encrypted, user);
```

#### 3. Validate Before Encrypting

```solidity
// ✅ Good
require(value > 0, "Value must be positive");
euint32 encrypted = FHE.asEuint32(value);

// ❌ Bad - no validation
euint32 encrypted = FHE.asEuint32(value);
```

#### 4. Use Appropriate Types

```solidity
// ✅ Good - right size for data
euint8 age;        // 0-255
euint32 amount;    // 0-4 billion
euint64 bigValue;  // Large numbers

// ❌ Bad - wasteful
euint256 age;      // Overkill for age
```

### TypeScript Best Practices

#### 1. Type Safety

```typescript
// ✅ Good
const contract: PrivacyInsuranceClaims = await factory.deploy();

// ❌ Bad
const contract = await factory.deploy();
```

#### 2. Error Handling

```typescript
// ✅ Good
await expect(contract.invalidOperation()).to.be.revertedWith("Error message");

// ❌ Bad - not checking for errors
await contract.invalidOperation();
```

#### 3. Clear Variable Names

```typescript
// ✅ Good
const monthlyPremium = 500;
const coverageLimit = 100000;

// ❌ Bad
const p = 500;
const c = 100000;
```

### Gas Optimization

1. **Batch operations** when possible
2. **Use appropriate uint sizes** (euint32 vs euint64)
3. **Minimize storage writes**
4. **Cache storage variables** in memory
5. **Use events** for off-chain data

### Security Considerations

1. **Always validate inputs** before encryption
2. **Set proper access control** for all encrypted values
3. **Use modifiers** for access control checks
4. **Emit events** for important state changes
5. **Follow checks-effects-interactions** pattern

## Troubleshooting

### Common Issues

#### 1. Compilation Errors

**Problem**: `Error: Cannot find module '@fhevm/solidity'`

**Solution**:
```bash
npm install @fhevm/solidity@latest
npm install
```

#### 2. Test Failures

**Problem**: Tests timeout

**Solution**: Increase timeout in `hardhat.config.ts`:
```typescript
mocha: {
  timeout: 120000, // 2 minutes
}
```

#### 3. Type Errors

**Problem**: TypeScript can't find types

**Solution**:
```bash
# Regenerate TypeChain types
npx hardhat typechain

# Or clean and recompile
npm run clean
npm run compile
```

#### 4. Gas Estimation Errors

**Problem**: Transaction fails with gas estimation error

**Solution**:
```typescript
// Manually set gas limit
await contract.method({ gasLimit: 1000000 });
```

#### 5. Import Errors

**Problem**: Cannot find FHEVM imports

**Solution**: Check import path matches your FHEVM version:
```solidity
// v0.9.x
import { FHE } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

### Getting Help

1. **Check Documentation**: https://docs.zama.ai/fhevm
2. **Search Issues**: Look for similar problems on GitHub
3. **Ask Community**: Zama Discord server
4. **Read Examples**: Check other FHEVM examples
5. **Review Tests**: Look at existing test files

## Advanced Topics

### Custom FHE Operations

Implementing custom encrypted logic:

```solidity
function customOperation(euint32 a, euint32 b) public returns (euint32) {
    euint32 sum = FHE.add(a, b);
    euint32 product = FHE.mul(a, b);
    euint32 result = FHE.div(product, sum);

    FHE.allowThis(result);
    FHE.allow(result, msg.sender);

    return result;
}
```

### Batch Processing

Processing multiple encrypted values:

```solidity
function batchProcess(uint32[] memory values) public {
    for (uint i = 0; i < values.length; i++) {
        euint32 encrypted = FHE.asEuint32(values[i]);
        // Process encrypted value
        FHE.allowThis(encrypted);
    }
}
```

### Integration Testing

Testing with other contracts:

```typescript
describe("Integration Tests", function () {
  let contractA: ContractA;
  let contractB: ContractB;

  beforeEach(async function () {
    contractA = await deployContractA();
    contractB = await deployContractB(contractA.address);
  });

  it("Should integrate correctly", async function () {
    // Test cross-contract interaction
  });
});
```

## Contributing

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Add tests** for new functionality
5. **Update documentation**
6. **Run** all tests and linting
7. **Submit** pull request

### Code Review Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] Gas optimization considered
- [ ] Security implications reviewed
- [ ] Comments are clear and helpful

## Resources

### Official Documentation

- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Hardhat Docs](https://hardhat.org/docs)

### Example Projects

- [Zama dApps](https://github.com/zama-ai/dapps)
- [FHEVM Contracts](https://github.com/zama-ai/fhevm-contracts)
- [OpenZeppelin Confidential](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

### Community

- [Zama Discord](https://discord.com/invite/zama)
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Twitter](https://twitter.com/zama_fhe)

---

**Last Updated**: December 2025
**Maintainer**: FHEVM Privacy Insurance Claims Contributors
**License**: MIT
