# FHEVM Examples Hub - Privacy Insurance Claims

> **A comprehensive FHEVM example project demonstrating privacy-preserving smart contracts**

## 🎯 Project Purpose

This project serves dual purposes:

1. **Production Example**: A complete privacy-preserving insurance claims system
2. **Educational Resource**: Demonstrates FHEVM concepts with automated documentation generation

## 📚 What's Included

### Core Example: Privacy Insurance Claims

A real-world healthcare application showing:
- **Encrypted Medical Data**: Diagnosis codes, treatment costs, patient age
- **Access Control**: Role-based permissions for insurance company, reviewers, and policy holders
- **Claim Lifecycle**: Complete workflow from submission to payment
- **Selective Decryption**: Only authorized parties can view encrypted data

### Automation Tools

#### 1. Example Generator (`create-fhevm-example.ts`)
Creates standalone FHEVM example repositories:
```bash
npm run generate:example
```

Features:
- Clones base Hardhat template
- Inserts contract and test files
- Generates documentation
- Creates deployment scripts

#### 2. Category Generator (`create-fhevm-category.ts`)
Creates projects with multiple related examples:
```bash
npm run generate:category basic ./output
```

Available categories:
- **basic**: FHECounter, encryption, decryption examples
- **advanced**: Privacy insurance, blind auctions

#### 3. Documentation Generator (`generate-docs.ts`)
Auto-generates GitBook-compatible docs from test comments:
```bash
npm run generate:docs
```

Generates:
- `README.md` with project overview
- Chapter files organized by `@chapter` tags
- `SUMMARY.md` for GitBook navigation

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test
```

### Creating New Examples

```bash
# Generate standalone example
npm run generate:example

# Generate category project
npm run generate:category basic ./output

# Generate documentation
npm run generate:docs
```

### Deployment

```bash
# Local deployment
npm run deploy

# Sepolia testnet
npm run deploy:sepolia
```

## 📖 Documentation Structure

### Auto-Generated Documentation

The project generates documentation from JSDoc comments in test files:

```typescript
/**
 * @title Feature Name
 * @notice User-friendly description
 * @dev Technical details
 * @chapter encryption
 */
describe("Feature", function () {
  // Tests here
});
```

This generates:
- `docs/encryption.md` - Encryption concepts
- `docs/access-control.md` - Access control patterns
- `docs/user-decryption.md` - User decryption examples

### Manual Documentation

- `README.md` - Main project documentation
- `DEVELOPER_GUIDE.md` - Comprehensive developer guide
- `CONTRIBUTING.md` - Contribution guidelines
- `SUBMISSION.md` - Competition submission details

## 🏗️ Architecture

### Contract Layer
```
contracts/
├── PrivacyInsuranceClaims.sol    # Main example contract
└── examples/
    ├── Counter.sol                # Plain counter (for comparison)
    └── FHECounter.sol             # Encrypted counter
```

### Test Layer
```
test/
└── PrivacyInsuranceClaims.test.ts  # Comprehensive test suite with JSDoc
```

### Automation Layer
```
automation/
├── create-fhevm-example.ts       # Single example generator
├── create-fhevm-category.ts      # Category project generator
└── generate-docs.ts              # Documentation generator
```

## 🔑 Key FHEVM Concepts Demonstrated

### 1. Encryption

```solidity
// Encrypt sensitive data
euint32 encryptedValue = FHE.asEuint32(plainValue);
```

### 2. Access Control

```solidity
// Grant permissions
FHE.allowThis(encryptedValue);  // Contract access
FHE.allow(encryptedValue, user); // User access
```

### 3. FHE Operations

```solidity
// Arithmetic on encrypted data
euint32 sum = FHE.add(encrypted1, encrypted2);
euint32 diff = FHE.sub(encrypted1, encrypted2);
```

### 4. Comparison Operations

```solidity
// Compare encrypted values
ebool isGreater = FHE.gt(value1, value2);
```

### 5. User Decryption

Users with proper permissions can decrypt their data off-chain while it remains encrypted on-chain to others.

## 🛠️ Available NPM Scripts

### Core Commands
```bash
npm test              # Run all tests
npm run compile       # Compile contracts
npm run deploy        # Deploy locally
npm run clean         # Clean artifacts
npm run coverage      # Generate coverage report
```

### Code Quality
```bash
npm run lint          # Lint TypeScript files
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format all code
```

### Documentation & Generation
```bash
npm run generate:docs       # Generate documentation
npm run generate:example    # Create new example repo
npm run generate:category   # Create category project
npm run help:examples       # Show example generator help
npm run help:category       # Show category generator help
```

### Deployment
```bash
npm run deploy:sepolia     # Deploy to Sepolia testnet
npm run verify             # Verify contract on Etherscan
```

## 📊 Project Statistics

| Component | Lines | Status |
|-----------|-------|--------|
| Main Contract | 324 | ✅ Complete |
| Example Contracts | ~200 | ✅ Complete |
| Test Suite | 723 | ✅ Complete |
| Automation Scripts | ~1,500 | ✅ Complete |
| Documentation | 2,000+ | ✅ Complete |
| **Total** | **~4,750** | **Production Ready** |

## 🎓 Learning Path

### Beginners
1. Read `contracts/examples/Counter.sol` (plain version)
2. Compare with `contracts/examples/FHECounter.sol` (encrypted version)
3. Run tests: `npx hardhat test`
4. Review generated documentation in `docs/`

### Intermediate
1. Study `contracts/PrivacyInsuranceClaims.sol`
2. Analyze test patterns in `test/PrivacyInsuranceClaims.test.ts`
3. Generate a new example: `npm run generate:example`
4. Review `DEVELOPER_GUIDE.md`

### Advanced
1. Study automation scripts in `automation/`
2. Create category projects: `npm run generate:category`
3. Implement custom FHEVM patterns
4. Review `DEVELOPER_GUIDE.md` advanced sections

## 🔒 Security Considerations

⚠️ **Important**: This is an educational example. Before production use:

1. ✅ Professional security audit
2. ✅ Comprehensive access control review
3. ✅ Gas optimization analysis
4. ✅ Integration with secure payment systems
5. ✅ Compliance verification (HIPAA, GDPR, etc.)
6. ✅ Key management strategy
7. ✅ Disaster recovery planning
8. ✅ Rate limiting and DoS protection

## 🤝 Contributing

We welcome contributions! Please see:
- `CONTRIBUTING.md` - Contribution guidelines
- `DEVELOPER_GUIDE.md` - Development setup and best practices

## 📄 License

MIT License - see `LICENSE` file for details

## 🌟 Use Cases

This example can be adapted for:

- **Healthcare**: Medical records, prescriptions, clinical trials
- **Finance**: Private transactions, credit scoring, encrypted portfolios
- **Voting**: Anonymous voting with verifiable results
- **Identity**: Privacy-preserving KYC, age verification
- **Supply Chain**: Confidential pricing, private inventory
- **DeFi**: Private trading, encrypted order books

## 📞 Support & Resources

### Documentation
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [FHEVM Contracts](https://github.com/zama-ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)

### Community
- [Zama Discord](https://discord.com/invite/zama)
- [Zama Community Forum](https://www.zama.ai/community)
- [Zama Twitter](https://twitter.com/zama_fhe)

### Examples & References
- [Zama dApps](https://github.com/zama-ai/dapps)
- [OpenZeppelin Confidential](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
- [Zama Bounty Program](https://www.zama.ai/bounty-program)

## 🎯 Competition Compliance

✅ **Zama Bounty Track December 2025 Requirements:**

- [x] Hardhat-based standalone repository
- [x] Complete FHEVM example with best practices
- [x] Comprehensive test suite with JSDoc annotations
- [x] Automation tools for scaffolding
- [x] Documentation generator
- [x] GitBook-compatible documentation
- [x] Base template structure
- [x] Category-based project generation
- [x] Developer guide for maintenance
- [x] Real-world use case demonstration
- [x] Multiple FHEVM concepts covered

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Security audit completed
- [ ] Gas optimization performed
- [ ] All tests passing
- [ ] Documentation up-to-date
- [ ] Environment variables configured
- [ ] Testnet deployment successful
- [ ] Monitoring and alerting setup
- [ ] Backup and recovery plan
- [ ] Team training completed
- [ ] Compliance requirements met

## 📈 Roadmap

### Current Version (v1.0.0)
- ✅ Privacy Insurance Claims example
- ✅ Automation tools
- ✅ Documentation generation
- ✅ Example contracts (Counter, FHECounter)

### Future Enhancements
- Additional example categories (voting, auctions, DeFi)
- Interactive CLI with prompts
- Video tutorials
- Integration with Zama Gateway
- More FHE operation examples
- Performance optimization guides

## 🙏 Acknowledgments

Built for the Zama FHEVM Bounty Program December 2025.

Special thanks to:
- Zama team for FHEVM technology
- FHEVM community contributors
- OpenZeppelin for confidential contracts patterns

---

**Built with ❤️ using Zama FHEVM - Making Privacy Possible**

*Last Updated: December 2025*
