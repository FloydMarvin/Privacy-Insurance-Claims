// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHE Counter Contract
 * @notice A privacy-preserving counter using Fully Homomorphic Encryption
 * @dev This demonstrates basic FHEVM concepts:
 * - Encrypting values with FHE.asEuint32()
 * - FHE arithmetic operations (FHE.add, FHE.sub)
 * - Access control with FHE.allow() and FHE.allowThis()
 * - Working with encrypted types (euint32)
 *
 * Key Difference from Plain Counter:
 * - Count value remains encrypted on-chain
 * - Increment/decrement values are encrypted
 * - Only authorized users can decrypt and view the count
 * - All arithmetic happens on encrypted data
 *
 * @chapter encryption
 * @chapter access-control
 */
contract FHECounter is SepoliaConfig {
    /// @notice The encrypted counter value
    /// @dev euint32 can hold values from 0 to 4,294,967,295
    euint32 private _count;

    /// @notice Owner of the counter (for access control)
    address public owner;

    event CountUpdated(address indexed user);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "FHECounter: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Initialize encrypted counter to 0
        _count = FHE.asEuint32(0);
        FHE.allowThis(_count);
        FHE.allow(_count, owner);
    }

    /**
     * @notice Returns the encrypted count
     * @dev The count is encrypted and can only be decrypted by authorized users
     * @return The encrypted count value (euint32)
     *
     * Important: This returns an encrypted value (handle), not the plaintext.
     * To get the actual value, authorized users must decrypt it off-chain.
     */
    function getCount() external view returns (euint32) {
        return _count;
    }

    /**
     * @notice Increments the counter by an encrypted value
     * @dev Demonstrates FHE addition on encrypted values
     *
     * Process:
     * 1. User encrypts increment value locally
     * 2. Encrypted value is sent to contract
     * 3. FHE.add performs addition on encrypted data
     * 4. Result remains encrypted
     * 5. Access permissions are granted
     *
     * @param value The encrypted amount to increment by
     *
     * Example usage:
     * ```typescript
     * const encrypted = await fhevm.encrypt32(5); // Encrypt value 5
     * await contract.increment(encrypted);
     * ```
     */
    function increment(inEuint32 calldata value) external {
        // Convert input to euint32
        euint32 encryptedValue = FHE.asEuint32(value);

        // Perform FHE addition
        _count = FHE.add(_count, encryptedValue);

        // Grant access permissions
        // allowThis: Contract needs access for future operations
        FHE.allowThis(_count);
        // allow: Grant caller access to view the result
        FHE.allow(_count, msg.sender);

        emit CountUpdated(msg.sender);
    }

    /**
     * @notice Decrements the counter by an encrypted value
     * @dev Demonstrates FHE subtraction on encrypted values
     *
     * Note: This example omits overflow/underflow checks for simplicity.
     * In production, you should implement proper range validation.
     *
     * @param value The encrypted amount to decrement by
     */
    function decrement(inEuint32 calldata value) external {
        euint32 encryptedValue = FHE.asEuint32(value);

        // Perform FHE subtraction
        _count = FHE.sub(_count, encryptedValue);

        // Grant access permissions
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit CountUpdated(msg.sender);
    }

    /**
     * @notice Resets the counter to zero (encrypted)
     * @dev Only owner can reset the counter
     */
    function reset() external onlyOwner {
        _count = FHE.asEuint32(0);
        FHE.allowThis(_count);
        FHE.allow(_count, owner);
        emit CountUpdated(msg.sender);
    }

    /**
     * @notice Grants access to view the encrypted count
     * @dev Allows owner to grant read permissions to other addresses
     * @param user Address to grant access to
     *
     * This demonstrates selective access control - a key feature of FHEVM.
     * Only explicitly authorized addresses can decrypt the count.
     */
    function grantAccess(address user) external onlyOwner {
        FHE.allow(_count, user);
    }

    /**
     * @notice Transfer ownership of the counter
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "FHECounter: new owner is zero address");
        address oldOwner = owner;
        owner = newOwner;

        // Grant new owner access to the count
        FHE.allow(_count, newOwner);

        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @notice Sets the count to a specific encrypted value
     * @dev Only owner can set the count directly
     * @param value The new encrypted count value
     *
     * This is useful for:
     * - Migrating from another contract
     * - Setting initial state
     * - Administrative operations
     */
    function setCount(inEuint32 calldata value) external onlyOwner {
        _count = FHE.asEuint32(value);
        FHE.allowThis(_count);
        FHE.allow(_count, owner);
        emit CountUpdated(msg.sender);
    }
}
